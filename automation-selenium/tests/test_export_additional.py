import time

import pytest

from pages.export_page import ExportPage


@pytest.mark.export
class TestExportAdditional:
    def test_TC_Element_002_popup_title_matches_framework(self, logged_in_driver, additional_test_data, auth_data, seeded_public_component):
        page = ExportPage(logged_in_driver)
        data = additional_test_data["export"]["TC_Element_002_PopupTitle"]
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        page.change_framework(data["framework"])
        page.open_export_popup()
        assert data["expected_title_fragment"] in page.get_popup_title()

    def test_TC_Element_003_code_matches_selected_framework(self, logged_in_driver, additional_test_data, auth_data, seeded_export_framework_component):
        page = ExportPage(logged_in_driver)
        data = additional_test_data["export"]["TC_Element_003_FrameworkCode"]
        page.open(f"{auth_data['base_url']}/element/{seeded_export_framework_component['_id']}")

        page.change_framework("React")
        page.open_export_popup()
        assert data["expected_react_fragment"] in page.get_code_text()
        page.close_popup_with_icon()
        assert page.is_not_visible(page.EXPORT_POPUP)

        page.change_framework("Vue")
        page.open_export_popup()
        assert data["expected_vue_fragment"] in page.get_code_text()

    def test_TC_Element_004_fallback_when_framework_code_missing(self, logged_in_driver, additional_test_data, auth_data, seeded_export_missing_lit_component):
        page = ExportPage(logged_in_driver)
        data = additional_test_data["export"]["TC_Element_004_Fallback"]
        page.open(f"{auth_data['base_url']}/element/{seeded_export_missing_lit_component['_id']}")
        page.change_framework("Lit")
        page.open_export_popup()
        assert data["expected_lit_fallback"] in page.get_code_text()

    def test_TC_Element_006_copy_button_resets_after_delay(self, logged_in_driver, additional_test_data, auth_data, seeded_public_component):
        page = ExportPage(logged_in_driver)
        data = additional_test_data["export"]["TC_Element_006_CopyReset"]
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        page.open_export_popup()
        page.copy_code()
        assert data["expected_immediate_fragment"] in page.get_copy_button_text().lower()
        time.sleep(data["wait_ms"] / 1000)
        assert data["expected_reset_fragment"] in page.get_copy_button_text().lower()

    def test_TC_Element_008_close_popup_with_icon(self, logged_in_driver, auth_data, seeded_public_component):
        page = ExportPage(logged_in_driver)
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        page.open_export_popup()
        page.close_popup_with_icon()
        assert page.is_not_visible(page.EXPORT_POPUP)

    def test_TC_Element_008_close_popup_with_footer_button(self, logged_in_driver, auth_data, seeded_public_component):
        page = ExportPage(logged_in_driver)
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        page.open_export_popup()
        page.close_popup_with_footer_button()
        assert page.is_not_visible(page.EXPORT_POPUP)

    def test_TC_Element_009_export_code_is_read_only(self, logged_in_driver, auth_data, seeded_public_component):
        page = ExportPage(logged_in_driver)
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        page.open_export_popup()
        assert page.is_code_read_only()

    def test_TC_Element_010_repeated_export_copy_stability(self, logged_in_driver, additional_test_data, auth_data, seeded_public_component):
        page = ExportPage(logged_in_driver)
        data = additional_test_data["export"]["TC_Element_010_Repeated"]
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")

        for _ in range(data["loops"]):
            page.open_export_popup()
            assert page.is_popup_visible()
            page.copy_code()
            assert "copy" in page.get_copy_button_text().lower()
            page.close_popup_with_footer_button()
            assert page.is_not_visible(page.EXPORT_POPUP)
