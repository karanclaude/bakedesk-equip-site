const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const VIEWS = path.join(__dirname, 'views');
const OUT = '/tmp/bakedesk-static';

// Clean output
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// Copy public assets
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
copyDir(path.join(__dirname, 'public'), OUT);

function render(viewPath, data = {}) {
  return ejs.renderFile(path.join(VIEWS, viewPath), data, {
    views: [VIEWS],
    filename: path.join(VIEWS, viewPath)
  });
}

function write(outPath, html) {
  const full = path.join(OUT, outPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  console.log(`  ✓ ${outPath}`);
}

async function build() {
  console.log('Building static site...\n');

  // Static pages
  const pages = [
    { view: 'index.ejs', out: 'index.html', title: "BakeDesk Equipment — India's Premium Bakery & Restaurant Equipment Marketplace" },
    { view: 'about.ejs', out: 'about/index.html', title: "About BakeDesk — India's Trusted Bakery & Restaurant Equipment Resource" },
    { view: 'contact.ejs', out: 'contact/index.html', title: 'Contact BakeDesk — Get a Free Equipment Quote' },
    { view: 'bakery-ovens.ejs', out: 'bakery-ovens/index.html', title: 'Bakery Ovens India — Deck, Convection, Rotary & Pizza Ovens | BakeDesk' },
    { view: 'mixers-and-processors.ejs', out: 'mixers-and-processors/index.html', title: 'Commercial Mixers & Food Processors India | BakeDesk' },
    { view: 'refrigeration.ejs', out: 'refrigeration/index.html', title: 'Commercial Refrigeration India | BakeDesk' },
    { view: 'restaurant-kitchen.ejs', out: 'restaurant-kitchen/index.html', title: 'Restaurant Kitchen Equipment India | BakeDesk' },
    { view: 'small-equipment.ejs', out: 'small-equipment/index.html', title: 'Small Bakery Equipment & Tools India | BakeDesk' },
    { view: 'sitemap.ejs', out: 'sitemap/index.html', title: 'Sitemap — BakeDesk Equipment India' },
    { view: '404.ejs', out: '404.html', title: 'Page Not Found — BakeDesk' },
  ];

  for (const p of pages) {
    try {
      const html = await render(p.view, { title: p.title, success: false });
      write(p.out, html);
    } catch (e) {
      console.error(`  ✗ ${p.view}: ${e.message}`);
    }
  }

  // Blog index
  try {
    const html = await render('blog/index.ejs', { title: "Bakery & Restaurant Equipment Guides India — BakeDesk Blog" });
    write('blog/index.html', html);
  } catch (e) {
    console.error(`  ✗ blog/index.ejs: ${e.message}`);
  }

  // Blog posts
  const blogDir = path.join(VIEWS, 'blog');
  const posts = fs.readdirSync(blogDir).filter(f => f.endsWith('.ejs') && f !== 'index.ejs');

  for (const post of posts) {
    const slug = post.replace('.ejs', '');
    try {
      const html = await render(`blog/${post}`, { title: slug });
      write(`blog/${slug}/index.html`, html);
    } catch (e) {
      console.error(`  ✗ blog/${post}: ${e.message}`);
    }
  }

  // .htaccess
  const htaccess = `RewriteEngine On

# Force HTTPS (uncomment when domain has SSL)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove trailing slash (except directories)
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)/$ /$1 [L,R=301]

# If request is not a file or directory, try adding /index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.*)$ $1/index.html [L]

# Custom 404
ErrorDocument 404 /404.html
`;
  fs.writeFileSync(path.join(OUT, '.htaccess'), htaccess);
  console.log('  ✓ .htaccess');

  console.log('\nDone! Output in /tmp/bakedesk-static/');
}

build().catch(console.error);
