from typing import Optional, Tuple
from urllib.parse import urlparse

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class BasePage:
    def __init__(self, driver: WebDriver, timeout: int = 20):
        self.driver = driver
        self.wait = WebDriverWait(driver, timeout)

    def open(self, url: str) -> None:
        self.driver.get(url)

    def find(self, locator: Tuple[str, str]):
        return self.wait.until(EC.presence_of_element_located(locator))

    def click(self, locator: Tuple[str, str]) -> None:
        self.wait.until(EC.element_to_be_clickable(locator)).click()

    def type(self, locator: Tuple[str, str], value: str, clear_first: bool = True) -> None:
        element = self.wait.until(EC.visibility_of_element_located(locator))
        if clear_first:
            element.clear()
        element.send_keys(value)

    def get_text(self, locator: Tuple[str, str]) -> str:
        return self.wait.until(EC.visibility_of_element_located(locator)).text

    def get_attribute(self, locator: Tuple[str, str], name: str) -> str:
        return self.find(locator).get_attribute(name) or ""

    def is_visible(self, locator: Tuple[str, str]) -> bool:
        try:
            self.wait.until(EC.visibility_of_element_located(locator))
            return True
        except Exception:
            return False

    def is_not_visible(self, locator: Tuple[str, str], timeout: int = 10) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(EC.invisibility_of_element_located(locator))
            return True
        except Exception:
            return False

    def get_current_url(self) -> str:
        return self.driver.current_url

    def wait_for_url_contains(self, fragment: str, timeout: int = 10) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(EC.url_contains(fragment))
            return True
        except Exception:
            return False

    def switch_to_iframe_if_exists(self, iframe_locator: Tuple[str, str]) -> bool:
        """Try switching into iframe. Return False if iframe does not exist."""
        try:
            self.wait.until(EC.frame_to_be_available_and_switch_to_it(iframe_locator))
            return True
        except Exception:
            return False

    def switch_to_default_content(self) -> None:
        self.driver.switch_to.default_content()

    def inject_auth_token_and_refresh(
        self,
        base_url: str,
        token_key: str,
        token_value: str,
        storage: str = "cookie",
        account_id: Optional[str] = None,
        user_role: Optional[str] = None,
    ) -> None:
        """
        Inject session token via cookie or localStorage and refresh to login directly.
        The browser must first open the target domain before setting cookie/localStorage.
        """
        self.driver.get(base_url)

        # UICommons uses localStorage for auth state.
        self.driver.execute_script(
            "window.localStorage.setItem(arguments[0], arguments[1]);",
            "authToken",
            token_value,
        )
        if account_id:
            self.driver.execute_script(
                "window.localStorage.setItem(arguments[0], arguments[1]);",
                "accountId",
                account_id,
            )
        if user_role:
            self.driver.execute_script(
                "window.localStorage.setItem(arguments[0], arguments[1]);",
                "userRole",
                user_role,
            )

        if storage.lower() == "cookie":
            parsed = urlparse(base_url)
            cookie_payload = {
                "name": token_key,
                "value": token_value,
                "path": "/"
            }
            if parsed.hostname:
                cookie_payload["domain"] = parsed.hostname
            self.driver.add_cookie(cookie_payload)
        elif storage.lower() == "localstorage":
            self.driver.execute_script(
                "window.localStorage.setItem(arguments[0], arguments[1]);",
                token_key,
                token_value,
            )

        self.driver.refresh()
