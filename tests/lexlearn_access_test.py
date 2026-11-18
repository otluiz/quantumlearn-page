"""Preview-only access rules; run with python3 tests/lexlearn_access_test.py."""
import asyncio
from playwright.async_api import async_playwright


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 1800})
        for route, button in [
            ("/login", "Entrar"),
            ("/cadastro", "Criar conta"),
            ("/recuperar-senha", "Enviar link de recuperação"),
        ]:
            await page.goto("http://localhost:8080" + route, wait_until="networkidle")
            await page.evaluate("localStorage.removeItem('nl-theme')")
            await page.reload(wait_until="networkidle")
            await page.get_by_role("button", name=button, exact=True).wait_for()
            # Wait for hydration through a visible interaction before exercising form handlers.
            await page.get_by_role("button", name="Usar tema claro").click()
            await page.get_by_role("button", name="Usar tema escuro").wait_for()
            await page.get_by_label("E-mail", exact=True).fill("exemplo@example.com")
            if route != "/recuperar-senha":
                await page.get_by_label("Senha", exact=True).fill("senha-apenas-de-exemplo")
            if route == "/cadastro":
                await page.get_by_label("Nome", exact=True).fill("Pessoa Exemplo")
                await page.get_by_label("Concurso que vai prestar").fill("Concurso de exemplo")
                await page.get_by_role("checkbox").check()
            # Every submit stays disabled, even with every field filled and consent checked.
            assert await page.get_by_role("button", name=button, exact=True).is_disabled()
            requests = []
            page.on("request", lambda request: requests.append(request.method))
            # Forced programmatic submit must be prevented as well as the normal button path.
            cancelled = await page.locator("form").evaluate(
                "form => !form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}))"
            )
            await page.get_by_label("E-mail", exact=True).press("Enter")
            await page.wait_for_timeout(300)
            assert cancelled, "Preview must prevent form submission"
            assert not any(method in ["POST", "PUT", "PATCH", "DELETE"] for method in requests)
            assert page.url.endswith(route), "Form must not navigate"
            print(route, "submission disabled and no data sent")
        await page.goto("http://localhost:8080/login", wait_until="networkidle")
        await page.evaluate("localStorage.removeItem('nl-theme')")
        await page.reload(wait_until="networkidle")
        await page.get_by_role("button", name="Usar tema claro").click()
        await page.get_by_role("button", name="Usar tema escuro").wait_for()
        await page.get_by_role("link", name="Explorar / conhecer a prévia").click()
        await page.wait_for_url("**/app")
        print("Explicit preview link opens /app")
        await browser.close()


asyncio.run(main())