import pytest

from pages.settings_page import SettingsPage


@pytest.mark.settings
class TestSettingsAdditional:
    def test_TC_PRF_006_multiline_bio(self, logged_in_driver, additional_test_data, auth_data):
        page = SettingsPage(logged_in_driver)
        data = additional_test_data["settings"]["TC_PRF_006_Multiline"]
        page.open_settings(auth_data["base_url"])
        page.update_profile(
            display_name=data["display_name"],
            bio=data["bio"],
            location=data["location"],
        )
        alert_text = page.get_alert_text().lower()
        assert any(keyword in alert_text for keyword in data["success_keywords"])
        page.open_settings(auth_data["base_url"])
        assert page.get_bio_value() == data["bio"]
