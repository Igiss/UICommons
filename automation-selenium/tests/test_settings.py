import pytest

from pages.settings_page import SettingsPage


@pytest.mark.settings
class TestSettings:
    def test_TC_PRF_001_update_profile(self, logged_in_driver, test_data, auth_data):
        page = SettingsPage(logged_in_driver)
        data = test_data["settings"]["TC_PRF_001_Update"]
        page.open_settings(auth_data["base_url"])
        page.update_profile(
            display_name=data["display_name"],
            bio=data["bio"],
            location=data["location"],
        )
        assert "thành công" in page.get_alert_text().lower()
