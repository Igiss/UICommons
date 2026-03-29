from typing import Tuple

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.base_page import BasePage


class SettingsPage(BasePage):
    DISPLAY_NAME_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, "input[name='userName']")
    BIO_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, "textarea[name='bio']")
    LOCATION_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, "input[name='address']")
    SAVE_BUTTON: Tuple[str, str] = (By.CSS_SELECTOR, ".spgForm button[type='submit']")

    def open_settings(self, base_url: str) -> None:
        self.open(f"{base_url}/settings")

    def update_profile(self, display_name: str, bio: str, location: str) -> None:
        self.type(self.DISPLAY_NAME_INPUT, display_name)
        self.type(self.BIO_INPUT, bio)
        self.type(self.LOCATION_INPUT, location)
        self.click(self.SAVE_BUTTON)

    def get_alert_text(self, timeout: int = 5) -> str:
        alert = WebDriverWait(self.driver, timeout).until(EC.alert_is_present())
        text = alert.text
        alert.accept()
        return text

    def get_display_name_value(self) -> str:
        return self.find(self.DISPLAY_NAME_INPUT).get_attribute("value") or ""

    def get_bio_value(self) -> str:
        return self.find(self.BIO_INPUT).get_attribute("value") or ""

    def get_location_value(self) -> str:
        return self.find(self.LOCATION_INPUT).get_attribute("value") or ""
