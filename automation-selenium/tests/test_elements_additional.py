import pytest

from pages.element_page import ElementPage


@pytest.mark.elements
class TestAddElementAdditional:
    def test_TC_Element_001_popup_visible_on_open(self, logged_in_driver, auth_data):
        page = ElementPage(logged_in_driver)
        page.open_add_element(auth_data["base_url"])
        assert page.is_popup_visible()

    def test_TC_Element_002_template_prefill_after_select(self, logged_in_driver, additional_test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = additional_test_data["elements"]["TC_Element_002_Template_Button"]
        page.open_add_element(auth_data["base_url"])
        page.select_category(data["category"])
        assert page.get_title_value() == data["expected_title"]
        assert page.preview_contains_text(data["expected_preview_text"])

    def test_TC_Element_004_save_as_draft_redirects(self, logged_in_driver, additional_test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = additional_test_data["elements"]["TC_Element_004_SaveDraft"]
        page.open_add_element(auth_data["base_url"])
        page.fill_element_form(data["category"], data["title"], data["html"], data["css"])
        page.save_as_draft()
        assert page.wait_for_url_contains(data["expected_redirect_fragment"])

    def test_TC_Element_005_submit_for_review_redirects(self, logged_in_driver, additional_test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = additional_test_data["elements"]["TC_Element_005_SubmitRedirect"]
        page.open_add_element(auth_data["base_url"])
        page.fill_element_form(data["category"], data["title"], data["html"], data["css"])
        page.submit()
        assert page.wait_for_url_contains(data["expected_redirect_fragment"])

    def test_TC_Element_011_change_type_reopens_popup(self, logged_in_driver, additional_test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = additional_test_data["elements"]["TC_Element_011_ChangeType"]
        page.open_add_element(auth_data["base_url"])
        page.select_category(data["initial_category"])
        page.click_change_type()
        assert page.is_popup_visible()

    def test_TC_Element_011_change_type_updates_template(self, logged_in_driver, additional_test_data, auth_data):
        page = ElementPage(logged_in_driver)
        data = additional_test_data["elements"]["TC_Element_011_ChangeType"]
        page.open_add_element(auth_data["base_url"])
        page.select_category(data["initial_category"])
        page.click_change_type()
        page.select_category(data["changed_category"])
        assert page.get_title_value() == data["expected_changed_title"]
        assert page.preview_contains_text(data["expected_preview_text"])
