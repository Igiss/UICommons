from typing import Tuple

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.base_page import BasePage


class SettingsPage(BasePage):
    """Page object for Settings page with all tabs: Profile, Email, Account, Achievements, Statistics."""

    # ── Sidebar Navigation ──
    SIDEBAR: Tuple[str, str] = (By.CSS_SELECTOR, ".spgSidebar")
    MENU_ITEMS: Tuple[str, str] = (By.CSS_SELECTOR, ".spgMenuItem")
    ACTIVE_MENU_ITEM: Tuple[str, str] = (By.CSS_SELECTOR, ".spgMenuItem.spgMenuItemActive")

    # ── Profile Tab ──
    DISPLAY_NAME_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, "input[name='userName']")
    BIO_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, "textarea[name='bio']")
    LOCATION_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, "input[name='address']")
    TWITTER_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, "input[name='twitter']")
    WEBSITE_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, "input[name='website']")
    COMPANY_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, "input[name='company']")
    SAVE_BUTTON: Tuple[str, str] = (By.CSS_SELECTOR, ".spgForm button[type='submit']")

    # ── Email Tab ──
    EMAIL_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, "input[type='email']")
    EMAIL_TOGGLE: Tuple[str, str] = (By.CSS_SELECTOR, ".toggle-switch")
    EMAIL_TOGGLE_SLIDER: Tuple[str, str] = (By.CSS_SELECTOR, ".toggle-slider")
    EMAIL_SAVE_BTN: Tuple[str, str] = (By.CSS_SELECTOR, ".email-btn-save")

    # ── Account Tab ──
    ACCOUNT_INFO_CARD: Tuple[str, str] = (By.CSS_SELECTOR, ".account-info-card")
    INFO_ROWS: Tuple[str, str] = (By.CSS_SELECTOR, ".info-row")
    INFO_INPUTS: Tuple[str, str] = (By.CSS_SELECTOR, ".info-input.disabled input")
    DELETE_BUTTON: Tuple[str, str] = (By.CSS_SELECTOR, ".delete-button")

    # ── Achievements Tab ──
    ACHIEVEMENTS_SECTION: Tuple[str, str] = (By.CSS_SELECTOR, ".achievements-section")
    ACHIEVEMENTS_SLOTS_LABEL: Tuple[str, str] = (By.CSS_SELECTOR, ".achievements-slots-label")
    ACHIEVEMENT_SLOTS: Tuple[str, str] = (By.CSS_SELECTOR, ".achievement-slot")
    EMPTY_SLOTS: Tuple[str, str] = (By.CSS_SELECTOR, ".empty-slot")
    EMPTY_SLOT_TEXT: Tuple[str, str] = (By.CSS_SELECTOR, ".empty-slot-text")
    ACHIEVEMENTS_BTN_RESET: Tuple[str, str] = (By.CSS_SELECTOR, ".achievements-btn-reset")
    ACHIEVEMENTS_BTN_SAVE: Tuple[str, str] = (By.CSS_SELECTOR, ".achievements-btn-save")

    # ── Statistics Tab ──
    METRICS_GRID: Tuple[str, str] = (By.CSS_SELECTOR, ".metrics-grid")
    STAT_CARDS: Tuple[str, str] = (By.CSS_SELECTOR, ".stat-card")
    CARD_TITLE: Tuple[str, str] = (By.CSS_SELECTOR, ".card-title")
    CARD_VALUE: Tuple[str, str] = (By.CSS_SELECTOR, ".card-value")
    CHART_SECTION: Tuple[str, str] = (By.CSS_SELECTOR, ".chart-section-card")
    CHART_TITLE: Tuple[str, str] = (By.CSS_SELECTOR, ".chart-title")
    CHART_CONTAINER: Tuple[str, str] = (By.CSS_SELECTOR, ".chart-container")

    # ── Navigation ──
    def _safe_open(self, url: str) -> None:
        """Dismiss any lingering alert then navigate."""
        try:
            self.driver.switch_to.alert.accept()
        except Exception:
            pass
        self.open(url)

    def open_settings(self, base_url: str) -> None:
        self._safe_open(f"{base_url}/settings")

    def open_email_tab(self, base_url: str) -> None:
        self._safe_open(f"{base_url}/settings/email")

    def open_account_tab(self, base_url: str) -> None:
        self._safe_open(f"{base_url}/settings/account")

    def open_achievements_tab(self, base_url: str) -> None:
        self._safe_open(f"{base_url}/settings/achievements")

    def open_stats_tab(self, base_url: str) -> None:
        self._safe_open(f"{base_url}/settings/stats")

    # ── Profile Tab Methods ──
    def update_profile(self, display_name: str, bio: str, location: str) -> None:
        self.type(self.DISPLAY_NAME_INPUT, display_name)
        self.type(self.BIO_INPUT, bio)
        self.type(self.LOCATION_INPUT, location)
        self.click(self.SAVE_BUTTON)
        self._dismiss_alert()

    def fill_display_name(self, name: str) -> None:
        self.type(self.DISPLAY_NAME_INPUT, name)

    def fill_bio(self, bio: str) -> None:
        self.type(self.BIO_INPUT, bio)

    def fill_twitter(self, url: str) -> None:
        self.type(self.TWITTER_INPUT, url)

    def fill_website(self, url: str) -> None:
        self.type(self.WEBSITE_INPUT, url)

    def click_save(self) -> None:
        self.click(self.SAVE_BUTTON)
        self._dismiss_alert()

    def _dismiss_alert(self) -> str:
        """Accept any alert and return its text, or empty string if no alert."""
        import time
        time.sleep(1)
        try:
            alert = self.driver.switch_to.alert
            text = alert.text
            alert.accept()
            return text
        except Exception:
            return ""

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

    # ── Email Tab Methods ──
    def is_email_readonly(self) -> bool:
        el = self.find(self.EMAIL_INPUT)
        return el.get_attribute("disabled") is not None or el.get_attribute("readonly") is not None

    def get_email_value(self) -> str:
        return self.find(self.EMAIL_INPUT).get_attribute("value") or ""

    def click_email_toggle(self) -> None:
        self.click(self.EMAIL_TOGGLE)

    def is_email_toggle_active(self) -> bool:
        el = self.find(self.EMAIL_TOGGLE)
        classes = el.get_attribute("class") or ""
        return "active" in classes

    def click_email_save(self) -> None:
        self.click(self.EMAIL_SAVE_BTN)
        self._dismiss_alert()

    # ── Account Tab Methods ──
    def get_account_inputs(self) -> list:
        return self.driver.find_elements(*self.INFO_INPUTS)

    def are_account_fields_readonly(self) -> bool:
        inputs = self.get_account_inputs()
        for inp in inputs:
            disabled = inp.get_attribute("disabled")
            readonly = inp.get_attribute("readonly")
            if disabled is None and readonly is None:
                return False
        return True

    def click_delete_account(self) -> None:
        self.click(self.DELETE_BUTTON)

    def is_confirm_dialog_present(self, timeout: int = 5) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(EC.alert_is_present())
            return True
        except Exception:
            return False

    def accept_confirm_dialog(self) -> str:
        alert = WebDriverWait(self.driver, 5).until(EC.alert_is_present())
        text = alert.text
        alert.accept()
        return text

    def dismiss_confirm_dialog(self) -> str:
        alert = WebDriverWait(self.driver, 5).until(EC.alert_is_present())
        text = alert.text
        alert.dismiss()
        return text

    # ── Achievements Tab Methods ──
    def is_achievements_section_visible(self) -> bool:
        return self.is_visible(self.ACHIEVEMENTS_SECTION)

    def get_slots_label(self) -> str:
        return self.get_text(self.ACHIEVEMENTS_SLOTS_LABEL)

    def get_empty_slots_count(self) -> int:
        return len(self.driver.find_elements(*self.EMPTY_SLOTS))

    def get_total_slots_count(self) -> int:
        return len(self.driver.find_elements(*self.ACHIEVEMENT_SLOTS))

    def click_reset_achievements(self) -> None:
        self.click(self.ACHIEVEMENTS_BTN_RESET)

    def click_save_achievements(self) -> None:
        self.click(self.ACHIEVEMENTS_BTN_SAVE)

    # ── Statistics Tab Methods ──
    def is_metrics_grid_visible(self) -> bool:
        return self.is_visible(self.METRICS_GRID)

    def get_stat_cards_count(self) -> int:
        return len(self.driver.find_elements(*self.STAT_CARDS))

    def get_stat_titles(self) -> list:
        titles = self.driver.find_elements(*self.CARD_TITLE)
        return [t.text for t in titles]

    def get_stat_values(self) -> list:
        values = self.driver.find_elements(*self.CARD_VALUE)
        return [v.text for v in values]

    def is_chart_visible(self) -> bool:
        return self.is_visible(self.CHART_SECTION)

    def get_chart_title(self) -> str:
        return self.get_text(self.CHART_TITLE)

    def is_chart_container_visible(self) -> bool:
        return self.is_visible(self.CHART_CONTAINER)

    # ── Social Links & Additional Methods ──
    def fill_social_links(self, field_name: str, value: str) -> None:
        """Fill social media links (Twitter, Website, etc) if available."""
        try:
            selectors = {
                "twitter": (By.NAME, "twitter"),
                "website": (By.NAME, "website"),
                "github": (By.NAME, "github"),
            }
            if field_name in selectors:
                self.fill(selectors[field_name], value)
        except Exception:
            pass

    def get_achievement_slots(self) -> list:
        """Get all achievement slot elements."""
        try:
            return self.driver.find_elements(*self.ACHIEVEMENT_SLOTS)
        except Exception:
            return []
