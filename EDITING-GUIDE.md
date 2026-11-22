# How to update the website

A plain-language guide for club members. No coding experience needed.

## The short version

- Almost everything you'll ever need to change lives in **one file: `_data/club.yml`**. That includes the deadline, award amount, address, Facebook link, events list and checklist.
- You can edit it in two ways:
  - **On GitHub**, in your web browser (Option A).
  - **With a fill-in-the-form editor** (Option B).
- After you save, the live website updates by itself in **about one to two minutes**.
- Every change is saved in history, so **nothing you do is permanent**. Any mistake can be undone (see "If something goes wrong").

---

## Option A: Edit on GitHub (in your web browser)

1. Go to the club's repository on github.com and sign in.
2. Click the **`_data`** folder, then click **`club.yml`**.
3. Click the **pencil icon** (✏️, "Edit this file") near the top right of the file.
4. Make your change. Follow these rules:
   - Change only the words **inside the "quote marks"**.
   - Keep the quote marks, the colon, and the spaces at the start of each line exactly as they are.
   - Lines starting with `#` are notes. The website ignores them.
5. Click the green **Commit changes…** button. In the box that opens, type a short note such as "Updated 2027 deadline", then click **Commit changes** again.
6. Wait one to two minutes, then reload the website. If you still see the old version, hold **Shift** while you click reload.

### Example

To set the deadline, find this line:

```yaml
  deadline: "[DEADLINE]"
```

and change it to:

```yaml
  deadline: "Friday, April 16, 2027"
```

## Option B: The form editor (Pages CMS)

This gives you simple labelled boxes instead of a text file. It's free and uses your GitHub sign-in.

1. Go to **https://app.pagescms.org** and click **Sign in with GitHub**.
2. Choose the club's website repository.
3. Click **Website settings**, fill in or change the boxes, then click **Save**.
4. To add the application PDF, use the **Application form (PDF)** box to upload it.

The site updates the same way: one to two minutes after you save.

*Note: the form editor may remove the `#` notes from `club.yml` when it saves. That's harmless, because the form shows its own labels and hints.*

---

## Common tasks

### Every year: new deadline and award

In `_data/club.yml`, under **scholarships**, update:

- `deadline`: how visitors should read the date, for example `"Friday, April 16, 2027"`.
- `award_amount`: for example `"$1,000 each"`.
- `deadline_date` (optional): the same date written as year-month-day, for example `"2027-04-16"`. When this is filled in, a live "days left" countdown appears next to the deadline. Leave it as `""` for no countdown.
- `application_pdf`: the new application form (see the next section).

### Put a new application form (PDF) online

1. In the repository, open the **`files`** folder.
2. Click **Add file → Upload files**, drag in the PDF, then click **Commit changes**. A simple file name with no spaces works best, for example `application-2027.pdf`.
3. In `_data/club.yml`, set:

   ```yaml
     application_pdf: "files/application-2027.pdf"
   ```

Until a PDF is set, the "Download" buttons show **"Email us for the application"** instead.

### Add the Facebook link

Copy the address of the club's Facebook page from your browser, then in `_data/club.yml` set:

```yaml
  facebook_url: "https://www.facebook.com/your-page-name"
```

The Facebook links in the footer and on the Events, Give and Contact pages appear automatically.

### Change the events list or the checklist

These are lists. Each item is on its own line, starting with a dash and a space:

```yaml
  yearly:
    - "Membership Tea"
    - "Black History Month program"
    - "A new event"
```

- To **add** an item, copy a line and change the words.
- To **remove** one, delete its whole line.
- Keep the same spacing at the start of each line.

### Change other wording on a page

Each page has its own file: `index.html` (home), `about.html`, `scholarships.html`, `apply.html`, `events.html`, `membership.html`, `give.html`, `contact.html` and `martha-briggs.html`.

1. Open the page file and click the pencil icon.
2. Use your browser's Find (**Ctrl+F**, or **Cmd+F** on a Mac) to locate the sentence.
3. Change only the words between the `>` and `<` marks. Leave everything inside the `< >` marks alone.
4. Commit as usual.

Text written like `{{ club.contact.email }}` comes from `club.yml`. Change it there, not on the page.

### Change the header, menu or footer

These are shared by every page, so you only edit them once:

- Header and phone menu: `_includes/header.html`
- Footer: `_includes/footer.html`

### Replace a picture

Pictures are in the **`images`** folder. Upload a new picture with **exactly the same file name** as the old one (for example `logo.png`), and it replaces the old one everywhere.

---

## Things that update themselves

- The **copyright year** in the footer.
- **"Years supporting"** on the home page (counted from 1920).
- **Next meeting** on the Membership page. It's worked out as 11:00 AM on the first Saturday of each month, September to June. If the schedule ever changes, ask a technical helper to update `js/motion.js`.

## If something goes wrong

- **The site didn't change after a few minutes:** open the repository's **Actions** tab.
  - A green check means it published. Try Shift + reload in your browser.
  - A red ✗ means the last edit has a typo. Usually it's a missing quote mark or changed spacing in `club.yml`. Open the file and compare the line you changed with the lines around it.
- **To undo a change:** open the file on GitHub and click **History**. Find the last good version, copy its text, and paste it back in with the pencil icon. A technical helper can also roll back a change in seconds.
- **Placeholders:** anything still in `[SQUARE BRACKETS]` on the live site is waiting for real information. Search `club.yml` for `[` to find them all.

## Where things are

| What | Where |
| --- | --- |
| Everyday details (deadline, address, Facebook, lists) | `_data/club.yml` |
| Wording on a page | that page's `.html` file |
| Header and phone menu | `_includes/header.html` |
| Footer | `_includes/footer.html` |
| Application PDF and other downloads | `files/` folder |
| Pictures | `images/` folder |
| Colours, fonts, layout (technical) | `css/styles.css`, `css/motion.css` |
| Animations and interactive pieces (technical) | `js/motion.js` |
