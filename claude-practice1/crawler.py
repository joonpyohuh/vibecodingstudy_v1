"""
아주대학교 공지사항 크롤러
Usage: py crawler.py
"""

import json
import re
import sys
from pathlib import Path

import requests
from bs4 import BeautifulSoup

BASE_URL  = "https://www.ajou.ac.kr"
LIST_URL  = f"{BASE_URL}/kr/ajou/notice.do"
OUT_PATH  = Path(__file__).parent / "src" / "data" / "notices.json"
MAX_COUNT = 10

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}


def fetch_notices() -> list[dict]:
    res = requests.get(LIST_URL, headers=HEADERS, timeout=15)
    res.raise_for_status()

    soup = BeautifulSoup(res.content, "html.parser", from_encoding="utf-8")
    rows = soup.select("table tbody tr")

    notices = []
    notice_id = 1

    for row in rows:
        tds = row.find_all("td")
        if len(tds) < 6:
            continue

        a_tag = row.find("a", href=True)
        if not a_tag:
            continue

        href = a_tag.get("href", "")

        # articleNo 추출 → id
        match = re.search(r"articleNo=(\d+)", href)
        article_no = int(match.group(1)) if match else notice_id

        # 제목: title 속성에서 "자세히 보기" 제거
        raw_title = a_tag.get("title", "").strip()
        title = re.sub(r"\s*자세히\s*보기$", "", raw_title).strip()

        # title 속성이 없으면 링크 텍스트 사용
        if not title:
            title = a_tag.get_text(" ", strip=True)

        # 카테고리
        category = tds[1].get_text(strip=True)

        # 날짜
        date = tds[5].get_text(strip=True)

        # 전체 URL
        if href.startswith("?"):
            link = f"{LIST_URL}{href}"
        elif href.startswith("/"):
            link = f"{BASE_URL}{href}"
        else:
            link = href

        notices.append({
            "id":       notice_id,
            "title":    title,
            "category": category,
            "date":     date,
            "link":     link,
        })

        notice_id += 1
        if len(notices) >= MAX_COUNT:
            break

    return notices


def main():
    print("[*] 아주대 공지사항 수집 중...")

    try:
        notices = fetch_notices()
    except requests.RequestException as e:
        print(f"[ERROR] 네트워크 오류: {e}", file=sys.stderr)
        sys.exit(1)

    if not notices:
        print("[ERROR] 공지사항을 찾지 못했습니다.", file=sys.stderr)
        sys.exit(1)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(
        json.dumps(notices, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"[OK] {len(notices)}개 수집 완료 -> {OUT_PATH}")
    for n in notices:
        title_safe = n['title'].encode('cp949', errors='replace').decode('cp949')
        cat_safe   = n['category'].encode('cp949', errors='replace').decode('cp949')
        print(f"   [{cat_safe}] {title_safe[:50]}  ({n['date']})")


if __name__ == "__main__":
    main()
