const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ──

// Homepage
app.get('/', (req, res) => {
  res.render('index', { title: "BakeDesk Equipment — India's Premium Bakery & Restaurant Equipment Marketplace" });
});

// About
app.get('/about', (req, res) => {
  res.render('about', { title: "About BakeDesk — India's Trusted Bakery & Restaurant Equipment Resource" });
});

// Contact
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact BakeDesk — Get a Free Equipment Quote', success: req.query.success === 'true' });
});

// Contact form POST
app.post('/contact', (req, res) => {
  console.log('── New Contact Form Submission ──');
  console.log('Name:', req.body.name);
  console.log('Phone:', req.body.phone);
  console.log('City:', req.body.city);
  console.log('Business:', req.body.business);
  console.log('Equipment:', req.body.equipment);
  console.log('Timestamp:', new Date().toISOString());
  console.log('────────────────────────────────');
  res.redirect('/contact?success=true');
});

// Category pages
app.get('/bakery-ovens', (req, res) => {
  res.render('bakery-ovens', { title: 'Bakery Ovens India — Deck, Convection, Rotary & Pizza Ovens | BakeDesk' });
});

app.get('/mixers-and-processors', (req, res) => {
  res.render('mixers-and-processors', { title: 'Commercial Mixers & Food Processors India — Planetary, Spiral, Dough Mixers | BakeDesk' });
});

app.get('/refrigeration', (req, res) => {
  res.render('refrigeration', { title: 'Commercial Refrigeration India — Fridges, Display Cases, Walk-in Coolers | BakeDesk' });
});

app.get('/restaurant-kitchen', (req, res) => {
  res.render('restaurant-kitchen', { title: 'Restaurant Kitchen Equipment India — Stoves, Fryers, Exhaust, Dishwashers | BakeDesk' });
});

app.get('/small-equipment', (req, res) => {
  res.render('small-equipment', { title: 'Small Bakery Equipment & Tools India — Trays, Moulds, Scales, Thermometers | BakeDesk' });
});

// Sitemap
app.get('/sitemap', (req, res) => {
  res.render('sitemap', { title: 'Sitemap — BakeDesk Equipment India' });
});

// Blog index
app.get('/blog', (req, res) => {
  res.render('blog/index', { title: "Bakery & Restaurant Equipment Guides India — BakeDesk Blog" });
});

// Blog posts
app.get('/blog/:slug', (req, res) => {
  const slug = req.params.slug;
  const viewPath = path.join(__dirname, 'views', 'blog', `${slug}.ejs`);
  if (fs.existsSync(viewPath)) {
    res.render(`blog/${slug}`, { title: slug });
  } else {
    res.status(404).render('404', { title: 'Page Not Found — BakeDesk' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found — BakeDesk' });
});

app.listen(PORT, () => {
  console.log(`BakeDesk Equipment running on http://localhost:${PORT}`);
});
