from datetime import datetime

import pytest

from conftest import capture_failure_evidence
from pages.element_page import ElementPage


@pytest.mark.elements
class TestAddElement:
    def test_TC_Element_001_happy_path(self, logged_in_driver, test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = test_data["elements"]["TC_Element_001_005"]
        page.open_add_element(auth_data["base_url"])
        page.fill_element_form(data["category"], data["title"], data["html"], data["css"], data["desc"])
        page.submit()

    def test_TC_Element_002_preview_update(self, logged_in_driver, test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = test_data["elements"]["TC_Element_002_Preview"]
        page.open_add_element(auth_data["base_url"])
        page.fill_element_form("Button", "Preview Test", data["updated_html"], data["updated_css"])
        assert page.preview_contains_text("Hello Automation")

    def test_TC_Element_003_invalid_missing_category(self, logged_in_driver, test_data, auth_data):
        page = ElementPage(logged_in_driver)
        page.open_add_element(auth_data["base_url"])
        assert page.is_category_continue_disabled()

    def test_TC_Element_005_happy_path(self, logged_in_driver, test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = test_data["elements"]["TC_Element_001_005"]
        page.open_add_element(auth_data["base_url"])
        unique_title = f"{data['title']} {datetime.now().strftime('%Y%m%d%H%M%S')}"
        page.fill_element_form(data["category"], unique_title, data["html"], data["css"], data["desc"])
        page.submit()

    def test_TC_Element_028_xss_payloads(self, logged_in_driver, test_data, auth_data):
        page = ElementPage(logged_in_driver)
        payloads = test_data["elements"]["TC_Element_028_XSS"]
        try:
            for item in payloads:
                page.open_add_element(auth_data["base_url"])
                page.fill_element_form("Button", item["title"], item["html"], item["css"])
                page.submit()
        except Exception:
            capture_failure_evidence(logged_in_driver, "TC_Element_028")
            raise

    def test_TC_Element_026_empty_code(self, logged_in_driver, test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = test_data["elements"]["TC_Element_026_Empty"]
        try:
            page.open_add_element(auth_data["base_url"])
            page.fill_element_form(data["category"], data["title"], data["html"], data["css"])
            page.submit()
            assert page.get_error()
        except Exception:
            capture_failure_evidence(logged_in_driver, "TC_Element_026")
            raise

    def test_TC_Element_025_title_spaces_only(self, logged_in_driver, additional_test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = additional_test_data["elements"]["TC_Element_025_TitleSpaces"]
        try:
            page.open_add_element(auth_data["base_url"])
            page.fill_element_form(data["category"], data["title"], data["html"], data["css"])
            page.submit()
            assert page.get_error()
        except Exception:
            capture_failure_evidence(logged_in_driver, "TC_Element_025")
            raise

    def test_TC_Element_029_unicode_inputs_render_stably(self, logged_in_driver, additional_test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = additional_test_data["elements"]["TC_Element_029_Unicode"]
        page.open_add_element(auth_data["base_url"])
        page.fill_element_form(data["category"], data["title"], data["html"], data["css"])
        assert page.preview_contains_text(data["expected_preview_text"])
