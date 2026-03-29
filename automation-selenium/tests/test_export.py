import pytest

from pages.export_page import ExportPage


@pytest.mark.export
class TestExport:
    def test_TC_Element_001_Exp_framework_change(self, logged_in_driver, test_data, auth_data, seeded_public_component):
        page = ExportPage(logged_in_driver)
        frameworks = test_data["export"]["TC_Element_001_Frameworks"]
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")

        for fw in frameworks:
            page.change_framework(fw)
            assert page.get_selected_framework() == fw.lower()

    def test_TC_Element_002_Exp_popup_ui(self, logged_in_driver, auth_data, seeded_public_component):
        page = ExportPage(logged_in_driver)
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        page.open_export_popup()
        assert page.is_popup_visible()

    def test_TC_Element_005_Exp_copy_clipboard(self, logged_in_driver, test_data, auth_data, seeded_public_component):
        page = ExportPage(logged_in_driver)
        data = test_data["export"]["TC_Element_005_Copy"]
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        page.open_export_popup()
        page.copy_code()
        button_text = page.get_copy_button_text()
        assert data["button_text_after"].lower() in button_text.lower() or data["success_msg"].lower() in button_text.lower()
