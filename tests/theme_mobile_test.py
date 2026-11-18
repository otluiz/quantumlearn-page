"""Shared theme persistence at 390px; run with python3 tests/theme_mobile_test.py."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
ROUTES = ["/", "/?v=editorial", "/?v=sinal", "/lexlearn", "/login", "/cadastro",
          "/recuperar-senha", "/app", "/app/study", "/app/flashcards",
          "/app/stats", "/app/settings", "/app/documents", "/app/chat"]
SHOTS = Path("/tmp/browser/theme/screenshots")


async def check(page, route, theme):
    await page.goto(BASE + route, wait_until="networkidle")
    await page.get_by_role("button", name="Usar tema claro" if theme == "dark" else "Usar tema escuro", exact=True).wait_for()
    assert await page.evaluate("document.documentElement.classList.contains('theme-' + '" + theme + "')")
    palette = await page.locator(".lexpubli").first.evaluate("el => getComputedStyle(el).getPropertyValue('--background').trim()")
    if theme == "dark":
        assert palette == "#111f30", (route, palette)
    elif theme == "light":
        assert palette == "#f7f9fc", (route, palette)
    assert await page.evaluate("document.documentElement.scrollWidth <= innerWidth"), route


async def main():
    SHOTS.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 390, "height": 844}, color_scheme="light")
        page = await context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        for route in ROUTES:
            await check(page, route, "dark")
        await page.screenshot(path=str(SHOTS / "dark-app.png"))
        await check(page, "/", "dark")
        await page.screenshot(path=str(SHOTS / "dark-home.png"))
        await page.get_by_role("button", name="Usar tema claro", exact=True).click()
        assert await page.evaluate("localStorage.getItem('nl-theme')") == "light"
        # Client navigation must honor the same saved choice as a reload.
        await page.get_by_role("button", name="Abrir menu", exact=True).click()
        await page.locator(".lp-mobile-nav").get_by_role("link", name="LexLearn").click()
        await page.wait_for_url("**/app")
        await page.get_by_role("button", name="Usar tema escuro", exact=True).wait_for()
        for route in ROUTES:
            await check(page, route, "light")
        await page.screenshot(path=str(SHOTS / "light-app.png"))
        await page.get_by_role("button", name="Usar tema escuro", exact=True).click()
        for route in ROUTES:
            await check(page, route, "dark")
        # An explicit neutral preference remains supported, without becoming the default.
        await page.evaluate("localStorage.setItem('nl-theme', 'neutral')")
        for route in ["/", "/lexlearn", "/login", "/app/settings"]:
            await check(page, route, "neutral")
        await page.get_by_role("button", name="Usar tema escuro", exact=True).click()
        await page.get_by_role("combobox", name="CONCURSO ATIVO · EXEMPLO").click()
        assert await page.get_by_role("listbox").evaluate("el => getComputedStyle(el).getPropertyValue('--background').trim()") == "#111f30"
        assert not errors, errors
        print("390px: all pages default dark despite light device preference; saved light/dark/neutral choices persist; portal follows theme; no runtime errors.")
        await browser.close()


asyncio.run(main())