import pytest
import tempfile
import requests
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from pathlib import Path

from pages.base_page import BasePage
from utils.data_loader import get_additional_test_data, get_auth_data, get_test_data


API_URL = "http://localhost:3000"
REPORTS_DIR = Path(__file__).parent / "reports"
SCREENSHOTS_DIR = REPORTS_DIR / "screenshots"


def _auth_headers(auth_data):
    return {
        "Authorization": f"Bearer {auth_data['token_value']}",
        "Content-Type": "application/json",
    }


def _create_component(auth_data, payload):
    response = requests.post(
        f"{API_URL}/components",
        headers=_auth_headers(auth_data),
        json=payload,
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def _create_comment(auth_data, component_id, content, parent_id=None):
    payload = {
        "content": content,
        "componentId": component_id,
    }
    if parent_id:
        payload["parentId"] = parent_id
    response = requests.post(
        f"{API_URL}/comments",
        headers=_auth_headers(auth_data),
        json=payload,
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def _safe_nodeid(nodeid: str) -> str:
    return (
        nodeid.replace("::", "__")
        .replace("/", "_")
        .replace("\\", "_")
        .replace(":", "_")
        .replace("[", "_")
        .replace("]", "_")
        .replace(" ", "_")
    )


def capture_failure_evidence(driver, test_id: str) -> Path | None:
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    screenshot_path = SCREENSHOTS_DIR / f"{_safe_nodeid(test_id)}.png"
    try:
        if driver.save_screenshot(str(screenshot_path)):
            return screenshot_path
    except Exception:
        return None
    return None


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    setattr(item, f"rep_{report.when}", report)


@pytest.fixture(autouse=True)
def capture_screenshot_on_failure(request):
    yield

    report = getattr(request.node, "rep_call", None)
    if report is None or report.passed:
        return

    driver = request.node.funcargs.get("driver") or request.node.funcargs.get("logged_in_driver")
    if driver is None:
        return

    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    screenshot_name = f"{_safe_nodeid(request.node.nodeid)}.png"
    screenshot_path = SCREENSHOTS_DIR / screenshot_name

    try:
        if not driver.save_screenshot(str(screenshot_path)):
            return
    except Exception:
        return

    html_plugin = request.config.pluginmanager.getplugin("html")
    extra_plugin = getattr(pytest, "html", None) or html_plugin
    if extra_plugin and hasattr(extra_plugin, "extras"):
        extra = getattr(report, "extra", [])
        extra.append(extra_plugin.extras.image(str(screenshot_path)))
        report.extra = extra


@pytest.fixture(scope="session")
def auth_data():
    return get_auth_data()


@pytest.fixture(scope="session")
def test_data():
    return get_test_data()


@pytest.fixture(scope="session")
def additional_test_data():
    return get_additional_test_data()


@pytest.fixture(scope="function")
def driver():
    options = Options()
    profile_dir = Path(tempfile.mkdtemp(prefix="selenium-chrome-"))
    # options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,1200")
    options.add_argument("--disable-notifications")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-first-run")
    options.add_argument("--no-default-browser-check")
    options.add_argument(f"--user-data-dir={profile_dir}")
    cached_driver = (
        Path.home()
        / ".wdm"
        / "drivers"
        / "chromedriver"
        / "win64"
        / "146.0.7680.165"
        / "chromedriver-win32"
        / "chromedriver.exe"
    )
    service = (
        Service(str(cached_driver))
        if cached_driver.exists()
        else Service(ChromeDriverManager().install())
    )

    driver = webdriver.Chrome(service=service, options=options)
    yield driver
    driver.quit()


@pytest.fixture(scope="function")
def logged_in_driver(driver, auth_data):
    base_page = BasePage(driver)
    base_page.inject_auth_token_and_refresh(
        base_url=auth_data["base_url"],
        token_key=auth_data["token_key"],
        token_value=auth_data["token_value"],
        storage=auth_data.get("storage", "cookie"),
        account_id=auth_data.get("account_id"),
        user_role=auth_data.get("user_role"),
    )
    return driver


@pytest.fixture(scope="function")
def seeded_public_component(auth_data):
    payload = {
        "title": "Automation Seed Public Component",
        "htmlCode": "<button class='seed-btn'>Seed</button>",
        "cssCode": ".seed-btn { background: #2563eb; color: white; padding: 8px 14px; border: 0; border-radius: 6px; }",
        "reactCode": "export default function Component(){ return <button className='seed-btn'>Seed</button>; }",
        "vueCode": "<template><button class='seed-btn'>Seed</button></template>",
        "svelteCode": "<button class='seed-btn'>Seed</button>",
        "litCode": "render(){ return html`<button class='seed-btn'>Seed</button>`; }",
        "category": "button",
        "status": "public",
    }
    return _create_component(auth_data, payload)


@pytest.fixture(scope="function")
def current_user_profile(auth_data):
    response = requests.get(
        f"{API_URL}/profile/me",
        headers={"Authorization": f"Bearer {auth_data['token_value']}"},
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


@pytest.fixture(scope="function")
def seeded_comment_scope_components(auth_data, additional_test_data):
    data = additional_test_data["comments"]["TC_COMMENT_002_FilterByElement"]
    component_a = _create_component(
        auth_data,
        {
            "title": data["component_a"]["title"],
            "htmlCode": "<button>A</button>",
            "cssCode": "button { color: white; background: #2563eb; }",
            "reactCode": "export default function A(){ return <button>A</button>; }",
            "vueCode": "<template><button>A</button></template>",
            "svelteCode": "<button>A</button>",
            "litCode": "render(){ return html`<button>A</button>`; }",
            "category": "button",
            "status": "public",
        },
    )
    component_b = _create_component(
        auth_data,
        {
            "title": data["component_b"]["title"],
            "htmlCode": "<button>B</button>",
            "cssCode": "button { color: white; background: #7c3aed; }",
            "reactCode": "export default function B(){ return <button>B</button>; }",
            "vueCode": "<template><button>B</button></template>",
            "svelteCode": "<button>B</button>",
            "litCode": "render(){ return html`<button>B</button>`; }",
            "category": "button",
            "status": "public",
        },
    )
    _create_comment(auth_data, component_a["_id"], data["component_a"]["comment"])
    _create_comment(auth_data, component_b["_id"], data["component_b"]["comment"])
    return {"component_a": component_a, "component_b": component_b}


@pytest.fixture(scope="function")
def seeded_export_framework_component(auth_data, additional_test_data):
    data = additional_test_data["export"]["TC_Element_003_FrameworkCode"]
    payload = {
        "title": data["title"],
        "htmlCode": data["htmlCode"],
        "cssCode": data["cssCode"],
        "reactCode": data["reactCode"],
        "vueCode": data["vueCode"],
        "svelteCode": data["svelteCode"],
        "litCode": data["litCode"],
        "category": data["category"],
        "status": "public",
    }
    return _create_component(auth_data, payload)


@pytest.fixture(scope="function")
def seeded_export_missing_lit_component(auth_data, additional_test_data):
    data = additional_test_data["export"]["TC_Element_004_Fallback"]
    payload = {
        "title": data["title"],
        "htmlCode": data["htmlCode"],
        "cssCode": data["cssCode"],
        "reactCode": data["reactCode"],
        "vueCode": data["vueCode"],
        "svelteCode": data["svelteCode"],
        "litCode": data["litCode"],
        "category": data["category"],
        "status": "public",
    }
    return _create_component(auth_data, payload)
