# BakeDesk Equipment Website — Complete UI/UX Audit & Fix Plan

> **Date:** 2026-03-18
> **Site:** BakeDesk Equipment (bakedesk.in)
> **Stack:** Node.js / Express / EJS (converted from static HTML)
> **Project path:** `/Users/karanlabra/bakedesk-equip-site/`

---

## How to Use This Document

This is a comprehensive audit of every UI/UX issue on the BakeDesk website. Each issue is categorized by severity and page. **Save this document to your memory** so you can reference it across conversations. Work through issues in the priority order listed. Each fix includes the exact file path, what's wrong, and what the correct implementation should be.

---

## Table of Contents

1. [Critical Structural Issues](#1-critical-structural-issues)
2. [Navigation & Header Issues](#2-navigation--header-issues)
3. [Homepage Issues](#3-homepage-issues)
4. [Category Pages Issues](#4-category-pages-issues)
5. [About Page Issues](#5-about-page-issues)
6. [Contact Page Issues](#6-contact-page-issues)
7. [Blog Listing Page Issues](#7-blog-listing-page-issues)
8. [Blog Article Pages Issues](#8-blog-article-pages-issues)
9. [CSS & Design System Issues](#9-css--design-system-issues)
10. [Missing Features to Add](#10-missing-features-to-add)
11. [SEO & Meta Issues](#11-seo--meta-issues)
12. [Mobile & Responsiveness Issues](#12-mobile--responsiveness-issues)
13. [Performance Issues](#13-performance-issues)
14. [Accessibility Issues](#14-accessibility-issues)
15. [Server & Backend Issues](#15-server--backend-issues)

---

## 1. Critical Structural Issues

### 1.1 Excessive Inline Styles Throughout Inner Pages
**Severity:** CRITICAL
**Files:** `views/about.ejs`, `views/contact.ejs`, all category page EJS files
**Problem:** Inner pages are riddled with inline `style=""` attributes instead of using CSS classes. Examples:
- `style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--charcoal);margin-bottom:1rem;"` on every `<h2>` in about.ejs
- `style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;margin-bottom:4rem;"` on layout divs
- `style="background:linear-gradient(135deg,var(--charcoal),var(--charcoal-mid));border-radius:16px;padding:2.5rem;color:#fff;text-align:center;"` on feature cards
- Contact page select element has a massive inline style string

**Fix:** Create proper CSS classes in `public/css/style.css` for ALL of these patterns:
```css
/* Inner page headings */
.inner-heading { font-family: var(--font-serif); font-size: 1.8rem; color: var(--charcoal); margin-bottom: 1rem; }
.inner-heading-lg { font-size: 1.8rem; margin-bottom: 1.5rem; }

/* About page stat card */
.about-stats-card { background: linear-gradient(135deg, var(--charcoal), var(--charcoal-mid)); border-radius: 16px; padding: 2.5rem; color: #fff; text-align: center; }
.about-stat-number { font-size: 2.5rem; font-weight: 800; color: var(--sage); font-family: var(--font-serif); }
.about-stat-label { font-size: 1rem; opacity: 0.8; margin-bottom: 1.5rem; }

/* Layout grids */
.grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; margin-bottom: 4rem; }
```
Then replace ALL inline styles in the EJS templates with these classes.

### 1.2 HTML Entity Emojis Instead of Actual Emojis or SVG Icons
**Severity:** HIGH
**Files:** `views/about.ejs`, `views/contact.ejs`
**Problem:** Emoji characters are rendered as HTML entities (`&#128269;`, `&#128176;`, `&#128737;`, `&#127942;`, etc.) instead of using actual emoji characters or, better yet, SVG icons that match the homepage's design language.
**Fix:** The homepage uses clean SVG icons throughout (star for reviews, shield for verified, map pin for delivery, chat for support). Inner pages should follow the same pattern. Replace all emoji entities with SVG icons from the same icon set used on the homepage. At minimum, use actual emoji characters (🔍, 💰, 🛡️) rather than entity codes.

### 1.3 Two Different CTA Section Designs
**Severity:** MEDIUM
**Files:** `views/about.ejs` bottom CTA section
**Problem:** The about page's bottom CTA section uses the homepage's polished `.cta-section` design (good), but some inner pages may still use the old flat design. Ensure ALL pages that have a bottom CTA section use the same `.cta-section` with `.cta-container` > `.cta-inner` pattern from the homepage.

---

## 2. Navigation & Header Issues

### 2.1 No Active State on Navigation Links
**Severity:** HIGH
**Files:** `views/partials/header.ejs`
**Problem:** The current nav doesn't highlight which page the user is on. All nav links look the same regardless of current page.
**Fix:** Pass a `currentPage` variable from each route in `server.js`, then in `header.ejs`:
```ejs
<a href="/bakery-ovens" class="<%= currentPage === 'bakery-ovens' ? 'nav-active' : '' %>">Ovens</a>
```
Add CSS:
```css
.nav-links a.nav-active {
    color: var(--charcoal);
    background: rgba(30, 28, 26, 0.08);
}
```

### 2.2 "Get a Quote" Button Misleading
**Severity:** MEDIUM
**Files:** `views/partials/header.ejs`
**Problem:** The nav CTA says "Get a Quote" but links directly to WhatsApp. Users expect a quote form, not a chat app. This creates a jarring experience — they click expecting a structured form and instead get redirected to an external app.
**Fix:** Either:
- (A) Change the button text to "WhatsApp Us" to set correct expectations, OR
- (B) Link it to `/contact` instead, where they can fill a structured quote request form, OR
- (C) Keep the WhatsApp link but change text to "Chat on WhatsApp" with a small WhatsApp icon

### 2.3 Mobile Menu Missing Close Animation Feedback
**Severity:** LOW
**Files:** `views/partials/scripts.ejs`
**Problem:** When the mobile menu is open and a link is clicked, the menu closes abruptly without any transition on the link items themselves. The opening animation staggers links beautifully, but closing doesn't reverse this.
**Fix:** Add a reverse stagger on close before actually hiding the overlay.

---

## 3. Homepage Issues

### 3.1 Video Hero CTA Button Styling Mismatch
**Severity:** HIGH
**Files:** `views/index.ejs`, `public/css/style.css`
**Problem:** The hero CTA buttons use inline styles: `style="padding:14px 28px;border-radius:24px;font-weight:600;text-decoration:none;font-size:0.95rem;"` and the class `btn-wa` which is styled as `background: var(--charcoal)` in CSS. This makes the primary CTA button dark/black on a dark video overlay — low contrast and hard to see.
**Fix:** The primary hero CTA should use the green WhatsApp color (`#25D366`) or a high-contrast accent color to stand out against the dark video overlay:
```css
.hero-video-content .btn-wa {
    background: #25D366;
    color: #fff !important;
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.35);
}
.hero-video-content .btn-wa:hover {
    background: #1fb855;
    box-shadow: 0 6px 28px rgba(37, 211, 102, 0.50);
}
```

### 3.2 Hero CTA Buttons Still Using Inline Styles
**Severity:** MEDIUM
**Files:** `views/index.ejs`
**Problem:** The hero section buttons have `style="padding:14px 28px;border-radius:24px;..."` inline instead of using the existing `.btn-primary` / `.btn-outline-pill` classes that are already defined in the CSS.
**Fix:** Replace inline-styled buttons with the design system's button classes:
```html
<a href="..." class="btn-primary btn-wa-green">Get a Quote on WhatsApp →</a>
<a href="..." class="btn-ghost-light">Call Us</a>
```

### 3.3 Hero Badge Using Inline Style
**Severity:** LOW
**Files:** `views/index.ejs`
**Problem:** The hero badge `<p class="hero-badge" style="color:rgba(255,255,255,0.6);font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;">` uses inline styles.
**Fix:** Add a `.hero-badge` class to the CSS and remove the inline style.

### 3.4 Missing "Trusted by 500+" Social Proof Section
**Severity:** HIGH
**Files:** `views/index.ejs`
**Problem:** The trust bar claims "500+ Verified Reviews" but there are ZERO actual testimonials, review quotes, or customer logos anywhere on the homepage. This is a credibility gap — you're claiming social proof without showing any.
**Fix:** Add a testimonials section between the categories and guides sections:
```html
<section class="section" id="testimonials">
  <div class="section-container">
    <div class="section-header reveal-up">
      <div class="eyebrow-tag">What Our Clients Say</div>
      <h2 class="section-heading">Trusted by<br><em>500+ Businesses</em></h2>
    </div>
    <div class="testimonials-grid">
      <!-- 3-4 testimonial cards with name, business, city, quote -->
    </div>
  </div>
</section>
```

### 3.5 No Search Functionality
**Severity:** HIGH
**Files:** `views/partials/header.ejs`, `server.js`
**Problem:** A site with 5 equipment categories and 40+ buying guides has no search. Users must browse manually.
**Fix:** Add a search icon in the nav that opens a search overlay/modal. Implement a basic server-side search across blog titles and category names. At minimum, add client-side filtering on the blog listing page.

---

## 4. Category Pages Issues

### 4.1 Verify Category Pages Use Design System
**Severity:** HIGH
**Files:** `views/bakery-ovens.ejs`, `views/mixers-and-processors.ejs`, `views/refrigeration.ejs`, `views/restaurant-kitchen.ejs`, `views/small-equipment.ejs`
**Problem:** Category pages were converted from the old static HTML which used a completely different design language (flat cards, undefined CSS vars, basic nav). Need to verify each page:
- Uses the `.page-hero` class for the hero section
- Uses proper `.card` classes instead of inline styles
- Product listings use a consistent card component
- Price ranges are formatted consistently (Indian comma format: ₹1,20,000 not ₹120,000)
- Comparison tables use `.article-content table` styles
- "Get a Quote" CTAs use the proper `.btn-primary .btn-wa-green` classes
- Related guides section links use clean URLs (no .html)

**Fix:** Audit each category page EJS file individually. For each one:
1. Check all headings use CSS classes, not inline font-family/color
2. Check all layout grids use CSS classes, not inline grid definitions
3. Check all product cards follow a consistent `.product-card` pattern
4. Check all CTAs use the design system button classes
5. Check all internal links use clean URLs
6. Add breadcrumbs: `Home > Category Name`

### 4.2 No Breadcrumbs on Most Pages
**Severity:** MEDIUM
**Files:** All inner page EJS files
**Problem:** Only the bakery ovens page had a breadcrumb in the original. Other pages lack navigation context.
**Fix:** Add breadcrumbs to ALL inner pages, just below the `.page-hero`:
```html
<div class="breadcrumb">
  <a href="/">Home</a><span>›</span><span>Bakery Ovens</span>
</div>
```
The breadcrumb CSS is already defined in `style.css` at line 1897. Just add `margin-top: 0` since page-hero already provides spacing.

### 4.3 No "Back to Top" Button
**Severity:** LOW
**Files:** All pages, `views/partials/scripts.ejs`, `public/css/style.css`
**Problem:** Category and blog pages are very long but have no way to quickly scroll back to the top.
**Fix:** Add a floating back-to-top button that appears after scrolling 500px:
```html
<button class="back-to-top" id="backToTop" aria-label="Back to top">↑</button>
```

---

## 5. About Page Issues

### 5.1 No Team/Founder Photos or Bios
**Severity:** HIGH
**Files:** `views/about.ejs`
**Problem:** The about page talks about "we" and "our specialists" but shows no human faces, no team photos, no founder story with a real person. For a B2B site targeting Indian business owners, trust is everything — and faces build trust.
**Fix:** Add a "Meet the Team" or "Our Founder" section with photos and brief bios. Even one founder photo with a paragraph helps enormously.

### 5.2 Stats Card Uses Emoji Instead of Designed Elements
**Severity:** MEDIUM
**Files:** `views/about.ejs`
**Problem:** The stats card shows a trophy emoji (&#127942;) and a flag emoji (&#127470;&#127475;). These look unprofessional in a business context.
**Fix:** Replace with SVG icons or styled text elements that match the design system.

### 5.3 "500+ Equipment Reviews & Guides" Claim
**Severity:** MEDIUM
**Files:** `views/about.ejs`
**Problem:** The stat card says "500+ Equipment Reviews & Guides" but the blog only has ~40 articles. This is misleading.
**Fix:** Change to accurate numbers, or clarify what "500+" refers to (e.g., "500+ Products Reviewed" across all guides).

### 5.4 No FAQ Section
**Severity:** MEDIUM
**Files:** `views/about.ejs`
**Problem:** Common questions about BakeDesk's service (Do you sell directly? What's your warranty policy? Do you deliver outside Delhi? How do I return equipment?) are not addressed.
**Fix:** Add a FAQ section using the existing `.faq-section` / `.faq-item` CSS that's already defined for blog pages.

---

## 6. Contact Page Issues

### 6.1 Form Submits But Goes Nowhere
**Severity:** CRITICAL
**Files:** `server.js`
**Problem:** The contact form POSTs to `/contact` which currently just `console.log`s the data and redirects. No email is sent, no data is stored, no notification is triggered. In production, form submissions are completely lost.
**Fix:** Implement at minimum ONE of:
- (A) Send an email using nodemailer or a transactional email service (SendGrid, Resend)
- (B) Send a WhatsApp notification via the WhatsApp Business API
- (C) Store submissions in a JSON file or database
- (D) Send to a Google Sheets via the Sheets API
- (E) Use a webhook to send to Slack/Discord

### 6.2 No Form Validation Feedback
**Severity:** HIGH
**Files:** `views/contact.ejs`
**Problem:** The form has `required` attributes but no visual validation feedback. When a user submits with missing fields, the browser's default validation popup appears — no custom styling, no inline error messages.
**Fix:** Add client-side validation with inline error messages:
```css
.contact-form input:invalid:not(:placeholder-shown) {
    border-color: #dc2626;
}
.field-error {
    color: #dc2626;
    font-size: 0.8rem;
    margin-top: -0.75rem;
    margin-bottom: 0.75rem;
}
```

### 6.3 No CAPTCHA or Spam Protection
**Severity:** HIGH
**Files:** `views/contact.ejs`, `server.js`
**Problem:** The contact form has zero spam protection. Any bot can POST to `/contact` repeatedly.
**Fix:** Add at minimum a honeypot field (hidden field that bots fill but humans don't):
```html
<div style="position:absolute;left:-9999px;">
  <input type="text" name="website" tabindex="-1" autocomplete="off">
</div>
```
Server-side: reject if `req.body.website` is not empty.

### 6.4 Success Message Doesn't Scroll Into View
**Severity:** LOW
**Files:** `views/contact.ejs`
**Problem:** After form submission, the page redirects to `/contact?success=true`. The success message appears at the top of the form, but if the user was scrolled down, they may not see it.
**Fix:** Add `id="form-section"` to the form area and redirect to `/contact?success=true#form-section`.

### 6.5 No Map on Contact Page
**Severity:** LOW
**Files:** `views/contact.ejs`
**Problem:** Location says "Delhi, India" but there's no visual map showing where BakeDesk is located.
**Fix:** Add a Google Maps embed or a static map image showing Delhi location.

---

## 7. Blog Listing Page Issues

### 7.1 No Thumbnails on Blog Cards
**Severity:** HIGH
**Files:** `views/blog/index.ejs`
**Problem:** Blog listing cards show emoji icons as thumbnails instead of actual images. The homepage article cards have beautiful images (exhaust-hood.jpg, roti-machine.jpg, etc.) but the blog listing page doesn't use them.
**Fix:** Add thumbnail images to blog cards. The images already exist in `public/images/`. Map articles to their relevant category images. If a 1:1 mapping isn't possible, use the closest category image.

### 7.2 No Filtering, Search, or Category Tabs
**Severity:** HIGH
**Files:** `views/blog/index.ejs`
**Problem:** 40+ articles displayed in a single long list with no way to filter. The page has section headings (Buyer's Guides, Comparisons, Setup Guides, etc.) but no clickable filter tabs.
**Fix:** Add filter tabs at the top:
```html
<div class="blog-filters">
  <button class="blog-filter active" data-filter="all">All</button>
  <button class="blog-filter" data-filter="buyers-guide">Buyer's Guides</button>
  <button class="blog-filter" data-filter="comparison">Comparisons</button>
  <button class="blog-filter" data-filter="setup">Setup Guides</button>
  <button class="blog-filter" data-filter="product">Product Guides</button>
</div>
```
Add `data-category` attributes to each card and use JS to filter.

### 7.3 No Article Dates or Author
**Severity:** MEDIUM
**Files:** `views/blog/index.ejs`
**Problem:** Blog cards don't show when articles were published or who wrote them. This hurts credibility and SEO.
**Fix:** Add a date line to each card: `<span class="blog-date">Updated March 2026</span>`

### 7.4 No Pagination
**Severity:** LOW
**Files:** `views/blog/index.ejs`
**Problem:** All 40+ articles load on one page. This is a very long scroll.
**Fix:** Either add pagination (show 12 per page) or at minimum add a "Show More" button that reveals articles in batches.

---

## 8. Blog Article Pages Issues

### 8.1 Blog Article Internal Links May Still Use .html Extensions
**Severity:** HIGH
**Files:** All `views/blog/*.ejs` files
**Problem:** Blog articles were converted from static HTML. Internal links within article content (e.g., links to other guides, links to category pages) may still use `.html` extensions like `href="bakery-ovens.html"` or `href="../bakery-ovens.html"`.
**Fix:** Search ALL blog EJS files for `.html` in href attributes and replace:
- `bakery-ovens.html` → `/bakery-ovens`
- `../bakery-ovens.html` → `/bakery-ovens`
- `blog/slug.html` → `/blog/slug`
- `../contact.html` → `/contact`
- etc.

### 8.2 Blog Sidebar Hidden on Mobile
**Severity:** MEDIUM
**Files:** `public/css/style.css` line 1909
**Problem:** The sidebar (with related guides and CTA) is `display: none` on mobile. This means mobile users miss the contact CTA entirely.
**Fix:** On mobile, move sidebar content below the article instead of hiding it:
```css
@media (max-width: 900px) {
    .article-wrap { grid-template-columns: 1fr; }
    .sidebar { position: static; margin-top: 2rem; }
}
```

### 8.3 Blog Articles Use Hardcoded Colors
**Severity:** MEDIUM
**Files:** `public/css/style.css` (blog article styles section)
**Problem:** Blog article styles use hardcoded hex colors (#111, #222, #444, #eee) instead of CSS variables from the design system. This means if the color palette ever changes, blog pages won't update.
**Fix:** Replace:
- `#111` → `var(--charcoal)`
- `#222` → `var(--charcoal-mid)`
- `#444` → `var(--ink)`
- `#eee` → `rgba(30, 28, 26, 0.08)`
- `#fff` → `var(--white)` or `var(--cream)`
- `#999` → `var(--ink-light)`

### 8.4 Blog Article Header Margin-Top Hardcoded
**Severity:** LOW
**Files:** `public/css/style.css` line 1735
**Problem:** `.article-header { margin-top: 52px; }` is hardcoded to account for the nav height. If the nav height changes, this breaks.
**Fix:** Use the same approach as `.page-hero` which uses `padding-top: 140px` to account for the fixed nav.

---

## 9. CSS & Design System Issues

### 9.1 Duplicate :root Blocks
**Severity:** HIGH
**Files:** `public/css/style.css`
**Problem:** There are TWO `:root` blocks — the original design system at line 14 and the "missing variables" block at line 1370. This is confusing and could cause specificity issues.
**Fix:** Merge all CSS variables into a single `:root` block at the top of the file. Move `--primary`, `--border`, `--bg`, `--text`, `--text-light`, `--accent` into the main `:root` block.

### 9.2 Dead CSS for Old Nav (.nav-wrap)
**Severity:** LOW
**Files:** `public/css/style.css` line 1640
**Problem:** `.nav-wrap` styles are still in the CSS but no page uses this class anymore (all pages now use `.nav-island`).
**Fix:** Remove the `.nav-wrap` styles.

### 9.3 Card Max-Width Constraint Too Aggressive
**Severity:** MEDIUM
**Files:** `public/css/style.css` lines 1654-1668
**Problem:** `.card, .blog-card { max-width: 400px; }` and `.card img { max-width: 400px !important; height: 220px !important; }` with `!important` flags. This prevents cards from filling their grid column on wider screens and the `!important` makes it hard to override.
**Fix:** Remove `!important` flags. Let cards fill their grid column naturally. Images should use `width: 100%; height: 200px; object-fit: cover;` without max-width constraints.

### 9.4 No Focus Styles for Keyboard Navigation
**Severity:** MEDIUM
**Files:** `public/css/style.css`
**Problem:** Interactive elements (buttons, links, form inputs) don't have visible focus outlines for keyboard users. The CSS resets likely remove default focus styles.
**Fix:** Add focus-visible styles:
```css
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
    outline: 2px solid var(--sage);
    outline-offset: 2px;
}
```

### 9.5 Unused .hero Class Styles Still in CSS
**Severity:** LOW
**Files:** `public/css/style.css` lines 521-605
**Problem:** The old `.hero`, `.hero-container`, `.hero-text`, `.hero-heading`, `.hero-sub`, `.hero-ctas`, `.hero-img-wrap`, `.hero-bezel`, `.hero-img` classes are still defined but no page uses them anymore (the video hero replaced them).
**Fix:** Remove these dead CSS rules to reduce file size.

---

## 10. Missing Features to Add

### 10.1 WhatsApp Floating Button
**Severity:** HIGH
**Problem:** The site relies heavily on WhatsApp for conversions, but there's no persistent WhatsApp button visible at all times.
**Fix:** Add a floating WhatsApp button in the bottom-right corner:
```html
<a href="https://wa.me/918826431351?text=..." class="whatsapp-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
  <svg><!-- WhatsApp icon --></svg>
</a>
```
```css
.whatsapp-float {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    background: #25D366;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
    z-index: 90;
    transition: transform 0.3s;
}
.whatsapp-float:hover { transform: scale(1.1); }
```

### 10.2 Cookie Consent Banner
**Severity:** MEDIUM
**Problem:** No cookie consent banner. If the site uses any analytics or tracking, this is a compliance issue.
**Fix:** Add a simple cookie consent banner at the bottom of the page.

### 10.3 404 Page
**Severity:** MEDIUM
**Files:** `views/404.ejs`
**Problem:** A 404 page exists but verify it uses the shared header/footer partials and has a useful design (search, popular links, etc.) rather than a blank page.

### 10.4 Loading/Skeleton States for Images
**Severity:** LOW
**Problem:** Images load without any placeholder, causing layout shifts.
**Fix:** Add a subtle background color to image containers that shows while images load:
```css
.cat-img-wrap, .article-img-wrap {
    background: var(--cream-warm);
}
```

---

## 11. SEO & Meta Issues

### 11.1 Missing Meta Tags on Inner Pages
**Severity:** HIGH
**Files:** `views/partials/header.ejs`
**Problem:** The header partial only sets `<title>` via the `title` variable. Inner pages are missing:
- `<meta name="description">` (unique per page)
- `<meta name="keywords">` (unique per page)
- `<link rel="canonical">` (unique per page)
- Open Graph tags (og:title, og:description, og:url, og:image)
**Fix:** Pass `description`, `canonical`, and `ogImage` variables from each route in server.js and use them in the header partial.

### 11.2 No Structured Data (Schema.org)
**Severity:** MEDIUM
**Problem:** No JSON-LD structured data for:
- Organization (on homepage/about)
- FAQ (on blog articles that have FAQ sections)
- Article (on blog posts)
- BreadcrumbList (on pages with breadcrumbs)
- Product (on category pages with prices)
**Fix:** Add JSON-LD scripts to relevant pages.

### 11.3 No sitemap.xml or robots.txt
**Severity:** HIGH
**Files:** `server.js`
**Problem:** No dynamic sitemap.xml. The static sitemap.html exists but search engines need XML sitemaps.
**Fix:** Add a `/sitemap.xml` route in server.js that generates an XML sitemap listing all pages.

### 11.4 No Favicon
**Severity:** MEDIUM
**Files:** `views/partials/header.ejs`
**Problem:** No `<link rel="icon">` in the header. The tab shows a generic browser icon.
**Fix:** Create a favicon (BD logo) and add to public/ and header partial.

---

## 12. Mobile & Responsiveness Issues

### 12.1 Contact Page Grid Breaks on Tablet
**Severity:** MEDIUM
**Files:** `public/css/style.css`
**Problem:** `.contact-grid { grid-template-columns: 1fr 1fr; }` only has a breakpoint at 768px. On tablets (768-1024px), the two columns are cramped.
**Fix:** Add a tablet breakpoint:
```css
@media (max-width: 900px) {
    .contact-grid { grid-template-columns: 1fr; }
}
```

### 12.2 About Page Stats Card Overflows on Small Screens
**Severity:** MEDIUM
**Files:** `views/about.ejs`
**Problem:** The stats card with large numbers (500+, 2026) can overflow its container on very narrow screens.
**Fix:** The `.about-intro` responsive rule exists but verify the stat numbers use responsive font sizes.

### 12.3 Trust Bar Scrollbar Hidden But No Scroll Indicator
**Severity:** LOW
**Files:** `public/css/style.css`
**Problem:** On mobile, the trust bar is horizontally scrollable but the scrollbar is hidden. Users have no visual cue that they can scroll.
**Fix:** Add a subtle gradient fade on the right edge or add scroll indicators (dots).

---

## 13. Performance Issues

### 13.1 Hero Video is 8MB
**Severity:** HIGH
**Files:** `public/hero-video.mp4`
**Problem:** `hero-video.mp4` is 8.3MB — extremely large for a hero video. On slow Indian mobile connections (3G), this will take 30+ seconds to load.
**Fix:**
1. Compress the video using FFmpeg: `ffmpeg -i hero-video.mp4 -vf scale=1280:-2 -crf 28 -preset slow -an hero-video-compressed.mp4`
2. Remove audio track (it's muted anyway): add `-an` flag
3. Target file size: under 2MB
4. Add a poster image (first frame as JPG) so something shows immediately:
```html
<video class="hero-video" autoplay muted loop playsinline poster="/images/hero-poster.jpg">
```

### 13.2 No Image Optimization
**Severity:** MEDIUM
**Files:** `public/images/`
**Problem:** Product images are likely not optimized (no WebP versions, no srcset for responsive sizes).
**Fix:** Convert images to WebP format. Add `<picture>` elements with WebP and JPG fallbacks. Add `srcset` for different viewport widths.

### 13.3 Google Fonts Loaded on Every Page
**Severity:** LOW
**Files:** `views/partials/header.ejs`
**Problem:** Two Google Fonts (Playfair Display + Plus Jakarta Sans) are loaded via external CSS on every page load.
**Fix:** Consider self-hosting the fonts to eliminate the external request. Use `font-display: swap` to prevent FOIT (flash of invisible text).

---

## 14. Accessibility Issues

### 14.1 SVG Icons Have No Accessible Labels
**Severity:** MEDIUM
**Files:** Throughout all templates
**Problem:** SVG icons (arrows, WhatsApp icon, phone icon, etc.) are used decoratively but some are inside links/buttons where they're the only content indicator.
**Fix:** Add `aria-hidden="true"` to decorative SVGs. For SVGs that are the only content in a button/link, add `aria-label` to the parent element.

### 14.2 Color Contrast on Muted Text
**Severity:** MEDIUM
**Files:** `public/css/style.css`
**Problem:** Several text colors may not meet WCAG AA contrast requirements:
- `var(--ink-light): #8A857E` on `var(--cream): #ffffff` — check contrast ratio
- Footer text `rgba(253, 251, 247, 0.35)` on `var(--charcoal-mid): #2E2B27` — very low contrast
**Fix:** Run all color combinations through a contrast checker. Increase opacity/darkness of muted text to meet 4.5:1 ratio for body text.

### 14.3 Form Labels Need Better Association
**Severity:** LOW
**Files:** `views/contact.ejs`
**Problem:** Labels use `for` attributes correctly, but the select element's label says "Type of Business *" — the asterisk isn't explained.
**Fix:** Add a note at the top of the form: "Fields marked with * are required."

---

## 15. Server & Backend Issues

### 15.1 No Error Handling Middleware
**Severity:** HIGH
**Files:** `server.js`
**Problem:** If any route throws an error, Express will show the default error page with a stack trace (in development) or a blank page (in production).
**Fix:** Add error handling middleware:
```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { title: 'Something went wrong' });
});
```

### 15.2 No Rate Limiting on Contact Form
**Severity:** HIGH
**Files:** `server.js`
**Problem:** The `/contact` POST endpoint has no rate limiting. An attacker could flood the server with form submissions.
**Fix:** Add rate limiting using `express-rate-limit`:
```javascript
const rateLimit = require('express-rate-limit');
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per window
    message: 'Too many submissions, please try again later.'
});
app.post('/contact', contactLimiter, (req, res) => { ... });
```

### 15.3 No CSRF Protection
**Severity:** MEDIUM
**Files:** `server.js`, `views/contact.ejs`
**Problem:** The contact form has no CSRF token. An attacker could create a page that auto-submits the form.
**Fix:** Use the `csurf` package or implement a simple token-based CSRF check.

### 15.4 No Compression Middleware
**Severity:** MEDIUM
**Files:** `server.js`
**Problem:** Express isn't compressing responses. HTML, CSS, and JS responses are sent uncompressed.
**Fix:** Add `compression` middleware:
```javascript
const compression = require('compression');
app.use(compression());
```

### 15.5 No Cache Headers for Static Assets
**Severity:** MEDIUM
**Files:** `server.js`
**Problem:** Static files (images, CSS, video) are served without cache headers. Every page visit re-downloads them.
**Fix:**
```javascript
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '7d',
    etag: true
}));
```

### 15.6 No Helmet for Security Headers
**Severity:** MEDIUM
**Files:** `server.js`
**Problem:** No security headers (X-Content-Type-Options, X-Frame-Options, Content-Security-Policy, etc.).
**Fix:**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 15.7 Blog Slug Route Doesn't Handle Missing Files Gracefully
**Severity:** MEDIUM
**Files:** `server.js`
**Problem:** If someone visits `/blog/nonexistent-slug`, the server might crash or show an EJS error instead of a clean 404.
**Fix:** In the blog slug route handler, check if the EJS file exists before rendering, and fall through to the 404 handler if not.

---

## Implementation Priority Order

### Phase 1 — Critical (Do First)
1. Remove all inline styles from inner pages (Issue 1.1)
2. Fix hero CTA button contrast on dark video (Issue 3.1)
3. Fix contact form to actually store/send submissions (Issue 6.1)
4. Add spam protection to contact form (Issue 6.3)
5. Compress hero video to under 2MB (Issue 13.1)
6. Add error handling middleware (Issue 15.1)
7. Add rate limiting (Issue 15.2)
8. Search and replace all remaining `.html` links in blog articles (Issue 8.1)
9. Merge duplicate :root CSS blocks (Issue 9.1)

### Phase 2 — High Priority
10. Add nav active states (Issue 2.1)
11. Add testimonials section to homepage (Issue 3.4)
12. Add blog thumbnails (Issue 7.1)
13. Add blog filtering (Issue 7.2)
14. Add breadcrumbs to all inner pages (Issue 4.2)
15. Fix blog sidebar on mobile (Issue 8.2)
16. Add floating WhatsApp button (Issue 10.1)
17. Add meta descriptions to all pages (Issue 11.1)
18. Add sitemap.xml route (Issue 11.3)
19. Add team/founder section to about page (Issue 5.1)
20. Fix "Get a Quote" button text (Issue 2.2)

### Phase 3 — Medium Priority
21. Replace blog hardcoded colors with CSS vars (Issue 8.3)
22. Remove dead CSS (.hero, .nav-wrap) (Issues 9.2, 9.5)
23. Fix card max-width constraints (Issue 9.3)
24. Add focus-visible styles (Issue 9.4)
25. Add compression middleware (Issue 15.4)
26. Add cache headers (Issue 15.5)
27. Add Helmet security headers (Issue 15.6)
28. Add JSON-LD structured data (Issue 11.2)
29. Add favicon (Issue 11.4)
30. Fix about page stat claims (Issue 5.3)
31. Add FAQ to about page (Issue 5.4)

### Phase 4 — Polish
32. Add search functionality (Issue 3.5)
33. Add back-to-top button (Issue 4.3)
34. Add blog pagination (Issue 7.4)
35. Add cookie consent banner (Issue 10.2)
36. Optimize images to WebP (Issue 13.2)
37. Self-host fonts (Issue 13.3)
38. Fix color contrast issues (Issue 14.2)
39. Add form validation feedback (Issue 6.2)
40. Add map to contact page (Issue 6.5)

---

## Design System Reference

Use these values consistently. Do NOT use hardcoded hex colors or inline styles.

| Variable | Value | Usage |
|---|---|---|
| `--cream` | `#ffffff` | Page background |
| `--cream-warm` | `#F5F0E8` | Section backgrounds |
| `--cream-deep` | `#EDE6D9` | Deeper warm backgrounds |
| `--sage` | `#8A9B7E` | Primary accent (badges, icons, tags) |
| `--sage-light` | `#B8C9AF` | Light accent |
| `--charcoal` | `#1E1C1A` | Primary text, dark backgrounds |
| `--charcoal-mid` | `#2E2B27` | Footer background |
| `--charcoal-soft` | `#3D3A34` | Button hover states |
| `--espresso` | `#4A3728` | Italic heading accents, link colors |
| `--wa-green` | `#25D366` | WhatsApp CTA buttons |
| `--ink` | `#5C5650` | Body text |
| `--ink-light` | `#8A857E` | Muted/secondary text |
| `--font-serif` | Playfair Display | Headings only |
| `--font-sans` | Plus Jakarta Sans | Body text, buttons, labels |

---

## File Reference

```
/Users/karanlabra/bakedesk-equip-site/
├── server.js                          # Express server & routes
├── package.json                       # Dependencies
├── .gitignore
├── public/
│   ├── css/style.css                  # All styles
│   ├── images/                        # Product images (20 files)
│   └── hero-video.mp4                 # Hero video (8.3MB — COMPRESS)
├── views/
│   ├── partials/
│   │   ├── header.ejs                 # Shared nav-island header
│   │   ├── footer.ejs                 # Shared footer
│   │   └── scripts.ejs                # Shared JS (nav, hamburger, reveal)
│   ├── index.ejs                      # Homepage
│   ├── about.ejs                      # About page
│   ├── contact.ejs                    # Contact page with form
│   ├── bakery-ovens.ejs               # Category page
│   ├── mixers-and-processors.ejs      # Category page
│   ├── refrigeration.ejs              # Category page
│   ├── restaurant-kitchen.ejs         # Category page
│   ├── small-equipment.ejs            # Category page
│   ├── sitemap.ejs                    # Sitemap page
│   ├── 404.ejs                        # 404 error page
│   └── blog/
│       ├── index.ejs                  # Blog listing
│       └── [40 article files].ejs     # Individual blog posts
└── WEBSITE-AUDIT-AND-FIX-PLAN.md      # This document
```
