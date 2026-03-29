from typing import Tuple

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

from pages.base_page import BasePage


class ExportPage(BasePage):
    FIRST_ELEMENT_CARD_LINK: Tuple[str, str] = (By.CSS_SELECTOR, ".grid .card[href*='/element/']")
    FRAMEWORK_DROPDOWN: Tuple[str, str] = (By.CSS_SELECTOR, ".export-select")
    EXPORT_POPUP: Tuple[str, str] = (By.CSS_SELECTOR, ".export-popup-overlay")
    OPEN_EXPORT_POPUP_BUTTON: Tuple[str, str] = (By.XPATH, "//div[contains(@class,'export-group')]//button[contains(@class,'action-btn') and contains(normalize-space(), 'Export')]")
    POPUP_TITLE: Tuple[str, str] = (By.CSS_SELECTOR, ".export-popup__header h3")
    POPUP_CLOSE_ICON: Tuple[str, str] = (By.CSS_SELECTOR, ".export-popup__close")
    COPY_BUTTON: Tuple[str, str] = (By.XPATH, "//div[contains(@class,'export-popup__footer')]//button[contains(., 'Copy code') or contains(., 'copy') or contains(., 'Copy')]")
    FOOTER_CLOSE_BUTTON: Tuple[str, str] = (By.XPATH, "//div[contains(@class,'export-popup__footer')]//button[contains(., 'Đóng') or contains(., 'Close')]")
    CODE_CONTENT: Tuple[str, str] = (By.CSS_SELECTOR, ".export-popup .cm-content")

    def open_export(self, base_url: str) -> None:
        self.open(f"{base_url}/elements/all")
        first_link = self.find(self.FIRST_ELEMENT_CARD_LINK)
        detail_url = first_link.get_attribute("href")
        if detail_url:
            self.open(detail_url)
            return
        first_link.click()

    def change_framework(self, framework: str) -> None:
        select = Select(self.find(self.FRAMEWORK_DROPDOWN))
        select.select_by_value(framework.lower())

    def get_selected_framework(self) -> str:
        select = Select(self.find(self.FRAMEWORK_DROPDOWN))
        return select.first_selected_option.get_attribute("value")

    def open_export_popup(self) -> None:
        self.click(self.OPEN_EXPORT_POPUP_BUTTON)

    def is_popup_visible(self) -> bool:
        return self.is_visible(self.EXPORT_POPUP)

    def get_popup_title(self) -> str:
        return self.get_text(self.POPUP_TITLE)

    def close_popup_with_icon(self) -> None:
        self.click(self.POPUP_CLOSE_ICON)

    def close_popup_with_footer_button(self) -> None:
        self.click(self.FOOTER_CLOSE_BUTTON)

    def copy_code(self) -> None:
        self.click(self.COPY_BUTTON)

    def get_copy_button_text(self) -> str:
        return self.get_text(self.COPY_BUTTON)

    def get_code_text(self) -> str:
        return self.get_text(self.CODE_CONTENT)

    def is_code_read_only(self) -> bool:
        return self.get_attribute(self.CODE_CONTENT, "contenteditable").lower() == "false"
