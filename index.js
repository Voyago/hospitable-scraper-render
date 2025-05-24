const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Iniciar sesión
  await page.goto('https://my.hospitable.com/user/hello?returnUrl=%2Fdashboard', {
    waitUntil: 'networkidle2',
    timeout: 0
  });

  try {
    const emailField = await page.$('input[type=email]');
    const passwordField = await page.$('input[type=password]');

    if (emailField && passwordField) {
      console.log('🔐 Formulario detectado, llenando credenciales...');
      await page.type('input[type=email]', process.env.HOSPITABLE_EMAIL);
      await page.type('input[type=password]', process.env.HOSPITABLE_PASSWORD);
      await page.click('button[type=submit]');
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    } else {
      console.log('✅ No hay formulario, posiblemente sesión activa.');
    }
  } catch (err) {
    console.log('⚠️ Error llenando formulario:', err.message);
  }

  // Ir a la página de reservas
  await page.goto('https://my.hospitable.com/reservations', {
    waitUntil: 'networkidle2',
    timeout: 0
  });

  // Capturar contenido
  const data = await page.evaluate(() => document.body.innerText);
  console.log('📦 Contenido capturado:\n', data);

  await browser.close();
})();
