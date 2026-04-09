from typing import List, Tuple

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.base_page import BasePage


class ProfilePage(BasePage):
    """Page object for User Profile page."""

    # ── Header Info ──
    PROFILE_PAGE: Tuple[str, str] = (By.CSS_SELECTOR, ".profile-page")
    PROFILE_HEADER: Tuple[str, str] = (By.CSS_SELECTOR, ".profile-header")
    PROFILE_AVATAR: Tuple[str, str] = (By.CSS_SELECTOR, ".profile-avatar .avatar")
    PROFILE_NAME: Tuple[str, str] = (By.CSS_SELECTOR, ".profile-info h1")
    PROFILE_USERNAME: Tuple[str, str] = (By.CSS_SELECTOR, ".profile-info .username")
    PROFILE_EMAIL: Tuple[str, str] = (By.CSS_SELECTOR, ".profile-info .email")
    SETTINGS_BTN: Tuple[str, str] = (By.CSS_SELECTOR, ".profile-info .settings-btn")

    # ── Tabs ──
    TAB_LIST: Tuple[str, str] = (By.CSS_SELECTOR, ".react-tabs__tab-list")
    TABS: Tuple[str, str] = (By.CSS_SELECTOR, ".react-tabs__tab")
    TAB_SELECTED: Tuple[str, str] = (By.CSS_SELECTOR, ".react-tabs__tab--selected")
    TAB_PANEL: Tuple[str, str] = (By.CSS_SELECTOR, ".react-tabs__tab-panel")

    # ── Post Cards ──
    CARDS_GRID: Tuple[str, str] = (By.CSS_SELECTOR, ".grid")
    CARD: Tuple[str, str] = (By.CSS_SELECTOR, ".card")
    CARD_TITLE: Tuple[str, str] = (By.CSS_SELECTOR, ".card-info h3")
    CARD_DATE: Tuple[str, str] = (By.CSS_SELECTOR, ".card-info .post-date")

    # ── Empty States ──
    EMPTY_STATE: Tuple[str, str] = (By.CSS_SELECTOR, ".empty-state")
    EMPTY_ICON: Tuple[str, str] = (By.CSS_SELECTOR, ".empty-icon")
    EMPTY_TITLE: Tuple[str, str] = (By.CSS_SELECTOR, ".empty-state h2")
    EMPTY_DESC: Tuple[str, str] = (By.CSS_SELECTOR, ".empty-state p")
    CREATE_BTN: Tuple[str, str] = (By.CSS_SELECTOR, ".create-btn")

    # ── Loading / Error ──
    PROFILE_LOADING: Tuple[str, str] = (By.CSS_SELECTOR, ".profile-loading")
    PROFILE_ERROR: Tuple[str, str] = (By.CSS_SELECTOR, ".profile-error")

    # ── Navigation ──
    def open_profile(self, base_url: str) -> None:
        self.open(f"{base_url}/profile")

    def open_other_profile(self, base_url: str, user_id: str) -> None:
        self.open(f"{base_url}/profile/{user_id}")

    # ── Header Info Methods ──
    def is_page_loaded(self) -> bool:
        return self.is_visible(self.PROFILE_PAGE)

    def get_display_name(self) -> str:
        return self.get_text(self.PROFILE_NAME)

    def get_username(self) -> str:
        return self.get_text(self.PROFILE_USERNAME)

    def get_email(self) -> str:
        return self.get_text(self.PROFILE_EMAIL)

    def is_email_visible(self) -> bool:
        try:
            WebDriverWait(self.driver, 5).until(
                EC.visibility_of_element_located(self.PROFILE_EMAIL)
            )
            return True
        except Exception:
            return False

    def is_avatar_visible(self) -> bool:
        return self.is_visible(self.PROFILE_AVATAR)

    def is_settings_btn_visible(self) -> bool:
        try:
            WebDriverWait(self.driver, 5).until(
                EC.visibility_of_element_located(self.SETTINGS_BTN)
            )
            return True
        except Exception:
            return False

    def click_settings_btn(self) -> None:
        self.click(self.SETTINGS_BTN)

    # ── Tabs Methods ──
    def get_tab_names(self) -> List[str]:
        tabs = self.driver.find_elements(*self.TABS)
        return [tab.text for tab in tabs]

    def click_tab(self, tab_name: str) -> None:
        tabs = self.driver.find_elements(*self.TABS)
        for tab in tabs:
            if tab.text.strip().lower() == tab_name.strip().lower():
                tab.click()
                return

    def get_active_tab_name(self) -> str:
        return self.get_text(self.TAB_SELECTED)

    def get_tab_count(self) -> int:
        return len(self.driver.find_elements(*self.TABS))

    # ── Post Cards Methods ──
    def get_cards(self) -> list:
        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_all_elements_located(self.CARD)
            )
            return self.driver.find_elements(*self.CARD)
        except Exception:
            return []

    def get_card_titles(self) -> List[str]:
        titles = self.driver.find_elements(*self.CARD_TITLE)
        return [t.text for t in titles]

    def has_cards(self) -> bool:
        return len(self.get_cards()) > 0

    # ── Empty State Methods ──
    def is_empty_state_visible(self) -> bool:
        return self.is_visible(self.EMPTY_STATE)

    def get_empty_title(self) -> str:
        return self.get_text(self.EMPTY_TITLE)

    def get_empty_description(self) -> str:
        return self.get_text(self.EMPTY_DESC)

    def is_create_btn_visible(self) -> bool:
        return self.is_visible(self.CREATE_BTN)

    def click_create_btn(self) -> None:
        self.click(self.CREATE_BTN)
