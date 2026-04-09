from datetime import datetime

import pytest

from conftest import capture_failure_evidence
from pages.comment_page import CommentPage


@pytest.mark.comments
class TestComments:
    def test_TC_COMMENT_001_new_comment(self, logged_in_driver, test_data, auth_data, seeded_public_component):
        page = CommentPage(logged_in_driver)
        data = test_data["comments"]["TC_COMMENT_001"]
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        content = f"{data['content']}{datetime.now().isoformat()}"
        page.add_comment(content)
        assert page.wait_until_comment_visible(content)

    def test_TC_COMMENT_002_list_comments(self, logged_in_driver, auth_data):
        page = CommentPage(logged_in_driver)
        page.open_comments(auth_data["base_url"])
        assert page.get_comments_text() is not None

    def test_TC_COMMENT_003_empty_comment(self, logged_in_driver, test_data, auth_data):
        page = CommentPage(logged_in_driver)
        invalid_payloads = test_data["comments"]["TC_COMMENT_003_Invalid"]
        page.open_comments(auth_data["base_url"])

        for payload in invalid_payloads:
            page.type(page.COMMENT_INPUT, payload["content"])
            assert page.is_comment_submit_disabled()

    def test_TC_COMMENT_005_reply_comment(self, logged_in_driver, test_data, auth_data):
        page = CommentPage(logged_in_driver)
        data = test_data["comments"]["TC_COMMENT_005_Reply"]
        page.open_comments(auth_data["base_url"])

        seed_comment = f"seed comment {datetime.now().isoformat()}"
        page.add_comment(seed_comment)
        assert page.wait_until_comment_visible(seed_comment)
        page.reply_first_comment(data["content"])
        assert page.wait_until_comment_visible(data["content"])

    def test_TC_COMMENT_024_max_length(self, logged_in_driver, test_data, auth_data):
        page = CommentPage(logged_in_driver)
        data = test_data["comments"]["TC_COMMENT_024_Boundary"]
        try:
            page.open_comments(auth_data["base_url"])
            content = data["repeat_char"] * data["repeat_count"]
            page.add_comment(content)
            alert_text = page.get_alert_text_if_present()
            if alert_text is not None:
                normalized = alert_text.lower()
                assert (
                    "fail" in normalized
                    or "error" in normalized
                    or "max" in normalized
                    or "length" in normalized
                    or "too long" in normalized
                )
            else:
                assert not page.wait_until_comment_visible(content, timeout=3)
        except Exception:
            capture_failure_evidence(logged_in_driver, "TC_COMMENT_024")
            raise

    def test_TC_COMMENT_021_min_length(self, logged_in_driver, additional_test_data, auth_data, seeded_public_component):
        page = CommentPage(logged_in_driver)
        data = additional_test_data["comments"]["TC_COMMENT_021_Minimum"]
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        content = f"{data['content']}{data['suffix_separator']}{datetime.now().strftime('%H%M%S')}"
        page.add_comment(content)
        assert page.wait_until_comment_visible(content)

    def test_TC_COMMENT_025_special_chars(self, logged_in_driver, additional_test_data, auth_data, seeded_public_component):
        page = CommentPage(logged_in_driver)
        data = additional_test_data["comments"]["TC_COMMENT_025_SpecialChars"]
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        content = f"{data['content']}{data['suffix_separator']}{datetime.now().strftime('%H%M%S')}"
        page.add_comment(content)
        assert page.wait_until_comment_visible(content)

    def test_TC_COMMENT_026_unicode_combining(self, logged_in_driver, additional_test_data, auth_data, seeded_public_component):
        page = CommentPage(logged_in_driver)
        data = additional_test_data["comments"]["TC_COMMENT_026_Unicode"]
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        content = f"{data['content']}{data['suffix_separator']}{datetime.now().strftime('%H%M%S')}"
        page.add_comment(content)
        assert page.wait_until_comment_visible(content)
