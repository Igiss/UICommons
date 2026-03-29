from typing import Optional, Tuple

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.base_page import BasePage


class CommentPage(BasePage):
    FIRST_ELEMENT_CARD_LINK: Tuple[str, str] = (By.CSS_SELECTOR, ".grid .card[href*='/element/']")
    COMMENT_LOGIN_PROMPT: Tuple[str, str] = (By.CSS_SELECTOR, ".comment-login-prompt")
    COMMENT_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, ".comment-form__textarea")
    SEND_COMMENT_BUTTON: Tuple[str, str] = (By.CSS_SELECTOR, ".comment-form__submit")
    COMMENT_LIST: Tuple[str, str] = (By.CSS_SELECTOR, ".comments-list")
    COMMENT_ITEMS: Tuple[str, str] = (By.CSS_SELECTOR, ".comments-list .comment")
    ROOT_COMMENT_ITEMS: Tuple[str, str] = (By.CSS_SELECTOR, ".comments-list > .comment")
    ROOT_COMMENT_TEXTS: Tuple[str, str] = (By.CSS_SELECTOR, ".comments-list > .comment .comment__text")
    ROOT_COMMENT_AUTHOR: Tuple[str, str] = (By.CSS_SELECTOR, ".comments-list > .comment .comment__author")
    ROOT_COMMENT_DATE: Tuple[str, str] = (By.CSS_SELECTOR, ".comments-list > .comment .comment__date")
    FIRST_COMMENT_REPLY_BUTTON: Tuple[str, str] = (By.CSS_SELECTOR, ".comments-list .comment .comment__reply-btn")
    REPLY_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, ".comment__reply-form .comment__textarea")
    SEND_REPLY_BUTTON: Tuple[str, str] = (By.CSS_SELECTOR, ".comment__reply-form .btn-primary")
    NO_COMMENTS_TEXT: Tuple[str, str] = (By.CSS_SELECTOR, ".no-comments")

    def open_comments(self, base_url: str) -> None:
        self.open(f"{base_url}/elements/all")
        first_link = self.find(self.FIRST_ELEMENT_CARD_LINK)
        detail_url = first_link.get_attribute("href")

        if detail_url:
            self.open(detail_url)
            return

        first_link.click()

    def add_comment(self, content: str) -> None:
        self.type(self.COMMENT_INPUT, content)
        button = self.find(self.SEND_COMMENT_BUTTON)

        # Some React renders keep button disabled unless an input event is dispatched explicitly.
        if button.get_attribute("disabled"):
            textarea = self.find(self.COMMENT_INPUT)
            self.driver.execute_script(
                """
                const el = arguments[0];
                const val = arguments[1];
                el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                """,
                textarea,
                content,
            )

        try:
            self.click(self.SEND_COMMENT_BUTTON)
        except Exception:
            button = self.find(self.SEND_COMMENT_BUTTON)
            self.driver.execute_script("arguments[0].click();", button)

    def reply_first_comment(self, content: str) -> None:
        reply_btn = self.find(self.FIRST_COMMENT_REPLY_BUTTON)
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", reply_btn)
        try:
            reply_btn.click()
        except Exception:
            self.driver.execute_script("arguments[0].click();", reply_btn)

        reply_input = self.find(self.REPLY_INPUT)
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", reply_input)
        self.type(self.REPLY_INPUT, content)

        # Ensure React state updates in case key events are not captured reliably.
        self.driver.execute_script(
            """
            const el = arguments[0];
            const val = arguments[1];
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            """,
            reply_input,
            content,
        )

        send_btn = self.find(self.SEND_REPLY_BUTTON)
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", send_btn)
        try:
            send_btn.click()
        except Exception:
            self.driver.execute_script("arguments[0].click();", send_btn)

    def get_comments_text(self) -> str:
        return self.get_text(self.COMMENT_LIST)

    def wait_until_comment_visible(self, content: str, timeout: int = 10) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(
                lambda d: content in d.find_element(*self.COMMENT_LIST).text
            )
            return True
        except Exception:
            return False

    def is_comment_submit_disabled(self) -> bool:
        button = self.find(self.SEND_COMMENT_BUTTON)
        return bool(button.get_attribute("disabled"))

    def has_any_comment_item(self) -> bool:
        return len(self.driver.find_elements(*self.COMMENT_ITEMS)) > 0

    def is_login_prompt_visible(self) -> bool:
        return self.is_visible(self.COMMENT_LOGIN_PROMPT)

    def is_no_comments_visible(self) -> bool:
        return self.is_visible(self.NO_COMMENTS_TEXT)

    def get_root_comment_texts(self) -> list[str]:
        return [element.text for element in self.driver.find_elements(*self.ROOT_COMMENT_TEXTS)]

    def get_first_root_comment_author(self) -> str:
        return self.driver.find_elements(*self.ROOT_COMMENT_AUTHOR)[0].text

    def get_first_root_comment_date(self) -> str:
        return self.driver.find_elements(*self.ROOT_COMMENT_DATE)[0].text

    def is_reply_form_visible(self) -> bool:
        return self.is_visible(self.REPLY_INPUT)

    def get_alert_text_if_present(self, timeout: int = 2) -> Optional[str]:
        try:
            alert = WebDriverWait(self.driver, timeout).until(EC.alert_is_present())
            text = alert.text
            alert.accept()
            return text
        except Exception:
            return None
