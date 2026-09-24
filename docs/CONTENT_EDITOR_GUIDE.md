# The Field Manual: Editing Your AMSOIL Website

### A Practical Maintenance & Content Guide for Brandon

Welcome to the engine room of your website (`syntheticperformanceusa.com/`).

You already know how mechanical systems operate: when an engine hesitates or a transmission slips, you don’t guess—you pull the schematics, trace the fuel and electrical lines, isolate the faulty component, and torque everything to factory spec.

A modern website works on the exact same principles. It is a modular machine assembled from blueprints (code), powered by an engine (the Astro build system), and displayed on a diagnostic test bench (your web browser).

This field manual is your **Factory Service Manual (FSM)**. It will guide you through setting up your digital workbench, locating any piece of text or pricing on your website in seconds, editing it safely without cracking the engine block, previewing your changes in real-time with instant dyno feedback, and saving your work to the service log.

---

## The Mechanical Translation Matrix

Throughout this manual, software concepts map directly to physical shop procedures:

| Web Concept          | Mechanical Equivalent                        | What It Actually Does                                                                                         |
| :------------------- | :------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **HTML**             | **Chassis & Frame**                          | The raw structural steel defining headlines, paragraphs, and buttons.                                         |
| **CSS**              | **Bodywork & Paint**                         | Controls color, typography, column widths, and responsive sheet metal.                                        |
| **JavaScript**       | **Sensors & Actuators**                      | Handles moving parts in the browser (e.g., mobile menus, dropdowns).                                          |
| **Astro**            | **High-Output Crate Engine**                 | Pre-assembles components into pure, static HTML before shipping to the user.                                  |
| **`localhost:4321`** | **The In-Shop Dyno / Test Bench**            | A private, isolated simulation running only on your computer. Nothing you do here touches the public highway. |
| **Hot Reloading**    | **Real-Time Dyno Telemetry**                 | When you turn a bolt (save a file), the dyno display updates immediately without restarting the engine.       |
| **`git pull`**       | **Factory Service Bulletins (TSBs)**         | Pulling down the latest updates from the engineering team before you begin work.                              |
| **`git status`**     | **Multi-Point Inspection Clipboard**         | Verifying exactly which parts, hoses, or fluids were altered.                                                 |
| **`git add .`**      | **Staging Replacement Parts**                | Bagging and tagging your modified parts onto the technician's cart.                                           |
| **`git commit`**     | **Stamping the Repair Order**                | Signing off on the milestone in the permanent shop service log.                                               |
| **`git push`**       | **Releasing the Vehicle to Highway**         | Uploading the approved work to the cloud so Cloudflare delivers it to customers worldwide.                    |
| **Syntax Error**     | **Cross-Threaded Fastener / Pinched O-Ring** | A missing quote or bracket that stops the assembly line cold to prevent a catastrophic breakdown.             |
| **Smart Quotes**     | **SAE Bolt in Metric Tapped Hole**           | Curved quotes from Word or Notes that look right to the eye but strip the code threads immediately.           |

---

## Table of Contents

1. [The Big Picture: How the Internet & Websites Work](#1-the-big-picture-how-the-internet--websites-work)
2. [Why Astro is Like a Crate Engine](#2-why-astro-is-like-a-crate-engine)
3. [How to Read the Commands in this Manual](#3-how-to-read-the-commands-in-this-manual)
4. [Part 1: Day 1 Setup (One-Time Workshop Setup)](#4-part-1-day-1-setup-one-time-workshop-setup)
5. [Part 2: The Daily Routine (Every Other Time You Work on the Site)](#5-part-2-the-daily-routine-every-other-time-you-work-on-the-site)
6. [Part 3: The Content Editing Playbook (Find → Edit → Verify)](#6-part-3-the-content-editing-playbook-find--edit--verify)
7. [Part 4: Understanding `.astro` Files (Blueprint Anatomy)](#7-part-4-understanding-astro-files-blueprint-anatomy)
8. [Part 5: Adding or Replacing Images & Photos](#8-part-5-adding-or-replacing-images--photos)
9. [Part 6: Saving & Publishing with Git (The Service Log Pipeline)](#9-part-6-saving--publishing-with-git-the-service-log-pipeline)
10. [Part 7: The Mechanic's Diagnostic Tree (Troubleshooting)](#10-part-7-the-mechanics-diagnostic-tree-troubleshooting)
11. [Reference Library & Technical Glossary](#11-reference-library--technical-glossary)

---

## 1. The Big Picture: How the Internet & Websites Work

Before turning wrenches, let's trace the electrical harness of the web:

```
+──────────────────────────+                  +──────────────────────────+
│     Customer Browser     │                  │    Edge Server Node      │
│  (Phone / Safari / Chrome│                  │  (Cloudflare Network)    │
+─────────────┬────────────+                  +─────────────┬────────────+
              │                                             │
              │  1. HTTP GET: "Send me brandonsoil.com"     │
              │────────────────────────────────────────────►│
              │                                             │
              │  2. Returns: HTML Document (Raw Chassis)    │
              │◄────────────────────────────────────────────│
              │                                             │
              │  3. Browser reads HTML, requests assets:    │
              │     - CSS (Paint, layout, styling)          │
              │     - Images (Oil jugs, equipment icons)    │
              │     - JavaScript (Mobile menus)             │
              │────────────────────────────────────────────►│
              │                                             │
              │  4. Returns requested styles, images, files │
              │◄────────────────────────────────────────────│
              │                                             │
              ▼                                             ▼
       Page Fully Assembled & Interactive for Customer
```

### The 4 Stages of Every Page Visit:

1. **The Request**: A customer clicks a link or types `https://syntheticperformanceusa.com/` into their [Web Browser](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works). The browser sends an [HTTP Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) across the internet.
2. **The Server Handshake**: A computer running on [Cloudflare Workers](https://developers.cloudflare.com/workers/) intercepts the request and instantly hands back an [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) document.
3. **The Assembly Process**: The customer's browser reads the HTML from top to bottom. As it reads, it sees calls for paint ([CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps)), photography (AVIF/WebP images), and interactive switches ([JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps)). It fetches those files in parallel.
4. **The Finished Vehicle**: Within fractions of a second, the browser stitches the chassis, paint, and trim together into the smooth visual interface the customer sees.

---

## 2. Why Astro is Like a Crate Engine

Traditional website platforms (like WordPress, React, or Shopify) ship tons of uncompiled code to the customer's phone. When someone opens a page on a weak mobile signal, their phone's processor has to execute millions of instructions just to assemble the text. That drains batteries, causes sluggish scrolling, and costs you sales.

We chose **[Astro](https://docs.astro.build/)** because it operates like a dyno-tuned, pre-assembled crate engine:

- **Pre-Fabricated Speed**: Astro compiles all the components into pure, static HTML and CSS ahead of time on the server. When a customer clicks your link, Cloudflare delivers a finished product in under 50 milliseconds.
- **Zero Runtime Bloat**: If a page only contains text, oil specs, and affiliate links, Astro strips away 100% of unnecessary JavaScript before delivery.
- **Modular Sub-Assemblies**: Instead of copy-pasting your phone number, dealer ZO number, or footer across 15 separate pages, we define them once in modular components (like `Header.astro` and `dealer.ts`). Astro bolts them together automatically every time the site builds.

---

## 3. How to Read the Commands in this Manual

To prevent confusion, follow these two command line rules:

> [!IMPORTANT]
> **Command Line Rules of Engagement:**
>
> 1. **Type ONLY the text inside the code box.** Do not type any leading dollar signs (`$`) or backticks (`` ` ``). Those are just tutorial markers.
> 2. **Whitespace and spelling are critical.** An accidental space or a lowercase letter where an uppercase letter belongs will prevent the command from running.
> 3. **Hit `Enter` (or `Return`)** after every command line to execute it.

---

## 4. Part 1: Day 1 Setup (One-Time Workshop Setup)

You only perform this section **once**. Once your workbench is configured, you will skip directly to [Part 2: The Daily Routine](#5-part-2-the-daily-routine-every-other-time-you-work-on-the-site).

```
                      [Day 1 Setup Sequence]
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 1. Git & ID │───►│ 2. Node.js  │───►│ 3. VS Code  │───►│ 4. Get Repo │───►│ 5. Install  │
│ Installation│    │  (LTS Only) │    │ & Extensions│    │   Folder    │    │ Dependencies│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

### Step 1: Install Git & Set Your Technician Identity

[Git](https://git-scm.com/doc) is the master service log that records every file modification.

#### Installation:

- **Windows**:
  1. Download the 64-bit installer from [git-scm.com/download/win](https://git-scm.com/download/win).
  2. Run the `.exe` installer.
  3. When the installer asks: _"Choosing the default editor used by Git"_, select **Use Visual Studio Code as Git's default editor**.
  4. For every other screen, keep the pre-selected default options and click **Next** until finished.
- **Mac**:
  1. Press `Cmd + Space` to open Spotlight, type `Terminal`, and press `Enter`.
  2. Type `git --version` and press `Enter`.
  3. If not already installed, macOS will display a prompt asking to install Developer Tools. Click **Install**.

#### Stamping Your Technician ID (CRITICAL):

Git requires an author name and email before it allows you to record any service checkpoints. If you skip this, your first attempt to save will fail.

Open your terminal or PowerShell and run these two commands (substituting your actual name and email):

```bash
git config --global user.name "Brandon Miller"
git config --global user.email "brandon@brandonsoil.com"
```

_Verify_: Run:

```bash
git --version
```

_(Should output `git version 2.4x.x` or similar)._

---

### Step 2: Install Node.js LTS (The Local Runtime Engine)

Astro requires [Node.js](https://nodejs.org/) to run on your local computer so it can compile the web files.

1. Go to the official download page: [nodejs.org](https://nodejs.org/).
2. Download the installer labeled **LTS (Long Term Support)**—version 20.x or 22.x.
3. Run the installer:
   > [!CAUTION]
   > **Windows Installer Checkbox Warning**:  
   > During installation, the installer may show a screen titled _"Tools for Native Modules"_ with a checkbox: _"Automatically install the necessary tools (Chocolatey, Python, Visual Studio C++ Build Tools)"_.  
   > **LEAVE THIS BOX UNCHECKED.**  
   > Checking it will download 4.5 GB of unnecessary C++ compilers and waste 45 minutes. Astro does not need them!

#### Refreshing Your Terminal:

After Node.js finishes installing, **close all open terminal or PowerShell windows** and open a new one. (The computer must reload its environment paths to see the new commands).

_Verify_: In your new terminal window, run:

```bash
node -v
npm -v
```

_(Node will print `v20.x` or `v22.x`, and `npm` will print `v10.x` or higher)._

---

### Step 3: Install Visual Studio Code & Recommended Extensions

[Visual Studio Code (VS Code)](https://code.visualstudio.com/) is your digital workbench. It gives you a file browser, search tools, and code editor all in one window.

1. Download and install VS Code from [code.visualstudio.com/Download](https://code.visualstudio.com/Download).
2. Open VS Code.
3. **Install the Astro Extension**:
   - On the far left sidebar, click the **Extensions** icon (looks like 4 square blocks, or press `Ctrl + Shift + X` on Windows / `Cmd + Shift + X` on Mac).
   - In the search bar, type `Astro`.
   - Click **Install** on the official extension titled **Astro** (by `astro-build`).
   - _(Recommended)_ Search for `Tailwind CSS IntelliSense` and install it as well.

> [!TIP]
> **Mac Users - Enable the `code` Terminal Command**:  
> In VS Code, press `Cmd + Shift + P` to open the Command Palette. Type `Shell Command: Install 'code' command in PATH` and press `Enter`. This lets you launch VS Code directly from your terminal by typing `code .`.

---

### Step 4: Create a Projects Directory & Obtain the Repository

To keep your files organized, create a dedicated folder on your computer rather than dumping files onto your desktop.

#### In Your Terminal or PowerShell:

```bash
mkdir -p ~/projects
cd ~/projects
```

_(On Windows PowerShell, you can also run: `mkdir C:\Projects; cd C:\Projects`)._

#### Getting the Code:

- **Option A: If Hosted on GitHub**:
  ```bash
  git clone https://github.com/jacobmiller22/brandonamsoil.git
  cd brandonamsoil
  ```
  _(If the repository is private, you will be prompted to log in to your GitHub account or paste a GitHub Personal Access Token)._
- **Option B: If Received as a ZIP Archive from Jacob**:
  1. Extract the `brandonamsoil.zip` file into your `~/projects` (or `C:\Projects`) directory.
  2. Rename or ensure the folder is called `brandonamsoil`.
  3. In your terminal, navigate inside: `cd ~/projects/brandonamsoil`.

---

### Step 5: Install Project Dependencies (The Hardware Box)

Your project uses specialized components like Astro, Tailwind CSS, and icon libraries. We install them using [`npm`](https://docs.npmjs.com/) (which was installed automatically with Node.js) or [`pnpm`](https://pnpm.io/) (the fast alternative).

In your terminal inside the `brandonamsoil` folder, run:

```bash
npm install
```

_(Or, if you prefer `pnpm`: run `npm install -g pnpm` followed by `pnpm install`)._

> [!WARNING]
> **Windows PowerShell Script Warning (`pnpm.ps1 cannot be loaded`)**:  
> If you run `pnpm` on Windows and PowerShell blocks it with an execution policy error, simply use standard `npm install` instead! It uses standard Node execution and never triggers Windows script blocking.

When the terminal prints `added ... packages in ...s`, your workbench is fully assembled and ready for work!

---

## 5. Part 2: The Daily Routine (Every Other Time You Work on the Site)

Whenever you want to make an update—fixing a sentence, changing your phone number, or updating a product category—follow this simple 5-step daily routine:

```
                      [The Daily 5-Step Routine]
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ 1. Open VS Code  │──►│ 2. Pull TSBs     │──►│ 3. Start Server  │──►│ 4. Edit Text &   │──►│ 5. Shut Down     │
│   at Project Dir │   │   (git pull)     │   │   (npm run dev)  │   │   Save (Ctrl+S)  │   │   (Ctrl + C)     │
└──────────────────┘   └──────────────────┘   └──────────────────┘   └──────────────────┘   └──────────────────┘
```

---

### Step 1: Open the Project in VS Code

- **The Easy Graphical Method**:
  1. Open VS Code.
  2. In the top menu bar, click **File** → **Open Folder...** (on Mac: **File** → **Open...**).
  3. Navigate to your `brandonamsoil` folder and click **Select Folder** / **Open**.
- **The Terminal Shortcut**:
  If you are inside the `brandonamsoil` directory in your terminal, simply type:
  ```bash
  code .
  ```

> [!TIP]
> **Did your sidebar disappear?**  
> If the left sidebar with your file tree is hidden, press **`Ctrl + B`** (Windows) or **`Cmd + B`** (Mac) to toggle it back into view. You can also go to top menu **View** → **Explorer**.

---

### Step 2: Pull Latest Changes (`git pull`)

Before you turn any bolts, check if any updates were made upstream by Jacob:

1. Open the VS Code integrated terminal: press **`Ctrl + ` `** (the backtick key next to the number `1` on your keyboard) or go to **Terminal** → **New Terminal**.
2. Run:
   ```bash
   git pull
   ```
   _(Git will update your local files so you are working on the latest version)._

---

### Step 3: Fire Up the Dyno Test Bench (`npm run dev`)

In that same VS Code terminal window, start the local development engine:

```bash
npm run dev
```

_(Or `pnpm dev` if you use pnpm)._

The engine will fire up in less than 500 milliseconds and display:

```text
  astro  v5.4.0 ready in 312 ms

  ┃ Local    http://localhost:4321/
  ┃ Network  use --host to expose
```

---

### Step 4: Open the In-Shop Dyno in Your Browser

1. Open your web browser (Chrome, Edge, Safari, Firefox).
2. Visit: **`http://localhost:4321`**

> [!NOTE]
> **Remember: `localhost:4321` is your private test bench.**  
> Nothing you do here is visible to the public or your customers. You can experiment freely without any risk of breaking the live website.

---

### Step 5: Real-Time Dyno Telemetry (Hot Reloading)

Position your screen with **VS Code on the left** and your **Web Browser on the right**:

1. Make an edit to any text in VS Code.
2. Press **`Ctrl + S`** (Windows) or **`Cmd + S`** (Mac) to save the file.
3. **Watch your browser window instantly update!** You don't even have to press the reload button. The dev server detects the save, compiles that specific section in 30ms, and updates the screen live.

---

### Step 6: Shutting Down the Test Bench Cleanly

When you finish your editing session:

1. Click into the VS Code terminal window.
2. Press **`Ctrl + C`**.
3. **On Windows**: If the terminal prompts `Terminate batch job (Y/N)?`, type **`Y`** and hit **`Enter`**.
4. The server turns off cleanly.

---

## 6. Part 3: The Content Editing Playbook (Find → Edit → Verify)

Never waste time hunting through dozens of code files. Use the **Bore Scope Search Method**.

---

### The Global Search Technique (Your Digital Bore Scope)

Whenever you spot something on the browser screen that you want to alter:

```
[1. Copy text from screen] ──► [2. Press Ctrl+Shift+F] ──► [3. Paste into Search] ──► [4. Click to Edit]
```

1. **Highlight and copy** a distinct 3–5 word phrase on the page you want to change (e.g., _"Providing personal lubrication expertise"_).
2. Switch to VS Code and press **`Ctrl + Shift + F`** (Windows) or **`Cmd + Shift + F`** (Mac) to open the **Global Search Panel** on the left.
3. Paste your phrase into the search box.
4. VS Code instantly displays every file and exact line number where that phrase appears.
5. Click the search result to jump directly to that line in the code editor!
6. Make your text update, press `Ctrl + S` to save, and glance over at your browser to verify the result.

---

### The Blueprint Map: Where Key Content Lives

Here is your vehicle component diagram for `src/`:

```
brandonamsoil/
├── public/                 # Static assets (images, logos, icons)
│   └── images/             # Product and shop photography
└── src/
    ├── config/
    │   └── dealer.ts       # Central Dealer Specs (Phone, Email, ZO #, Name)
    ├── pages/              # Individual Website Pages
    │   ├── index.astro     # Homepage
    │   ├── about.astro     # About Brandon & Lubrication Bio
    │   ├── preferred-customer.astro  # $10 PC Program & ROI Matrix
    │   ├── commercial-wholesale.astro # Fleet & Retail Accounts
    │   └── become-a-dealer.astro      # Dealership Business Opportunity
    └── components/         # Modular Page Sections
        ├── Header.astro    # Sticky top navigation bar & phone CTA
        ├── Hero.astro      # Homepage top banner with action buttons
        ├── Footer.astro    # Bottom legal disclosures & quick links
        ├── VehicleGrid.astro # 8 equipment lookup cards (Cars, Trucks, ATVs...)
        └── TrustBadges.astro # Warranty and factory shipping assurance badges
```

#### 1. Central Dealer Information: [`src/config/dealer.ts`](../src/config/dealer.ts)

This single file acts as the master ECU calibration for your dealership contact info.

```typescript
export const dealerConfig: DealerConfig = {
  zoNumber: "31977476",
  dealerName: "Brandon Miller",
  title: "AMSOIL Authorized Independent Dealer",
  email: "syntheticperformanceusa@gmail.com/",
  location: "Serving Customers Nationwide (US & Canada)",
  tagline:
    "Save up to 25% on Factory-Direct AMSOIL Synthetic Lubricants & Filters",
  // ...
};
```

- **To change your business phone number**: Change the text between the quotes on line 29: `phone: "(555) 321-4567"`.
- **To update your business email or tagline**: Edit the text between the quotes on lines 30 and 33.
- **Save the file**: Every single phone link, email button, header, and footer across all 7 pages updates instantly.

#### 2. Individual Pages: [`src/pages/`](../src/pages/)

- Edit `about.astro` to update your mechanic credentials, shop background, or personal story.
- Edit `preferred-customer.astro` to update pricing promotions or savings breakdowns.
- Edit `commercial-wholesale.astro` to refine wholesale pitch points for local fleets and landscapers.

---

## 7. Part 4: Understanding `.astro` Files (Blueprint Anatomy)

Every `.astro` file is split into two zones divided by three hyphens (`---`):

```astro
---
// =====================================================================
// 1. THE FRONTMATTER (The Engine Block / Calibration Zone)
// JavaScript imports and data configurations live up here.
// You rarely need to touch this unless changing page title or meta tags.
// =====================================================================
import Layout from '../layouts/Layout.astro';
import { dealerConfig } from '../config/dealer';

const pageTitle = "About Brandon Miller | Master Mechanic & AMSOIL Dealer";
---

<!-- ================================================================== -->
<!-- 2. THE TEMPLATE (The Bodywork / Visual HTML Zone)                   -->
<!-- The actual visual text and structure live down here.              -->
<!-- ================================================================== -->
<section class="py-16 bg-slate-950">
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold text-white">
      About {dealerConfig.dealerName}
    </h1>
    <p class="text-slate-300 mt-4 leading-relaxed">
      Welcome to my independent AMSOIL dealership. As a veteran mechanic,
      I know firsthand that preventative maintenance and superior synthetic
      lubrication save thousands of dollars in repairs down the road.
    </p>
  </div>
</section>
```

### Safety Rules When Editing Code:

> [!WARNING]
> **RULE 1: The "Smart Quotes" Danger (SAE Bolt in Metric Hole)**  
> Text editors like Microsoft Word and Apple Notes automatically convert straight quotes (`"..."`) into curved "smart quotes" (`“...”`).  
> **In code, curved quotes are an illegal character that will crack the engine block (trigger a syntax error).**  
> Always write your text directly inside VS Code, or ensure your quotes are straight.

> [!IMPORTANT]
> **RULE 2: Apostrophes Inside Text Strings**  
> If your business name or headline includes an apostrophe (like `Brandon's Synthetic Oil`), keep the outer quotes as **double quotation marks** (`"..."`).  
> If you wrap the string in single quotes (`'Brandon's'`), the middle apostrophe cuts the string in half and causes a syntax failure.

> [!TIP]
> **RULE 3: Don't Strip the HTML Brackets**  
> In `<p class="...">Your text here</p>`, the `<p>` is the opening bracket and `</p>` is the closing bracket.  
> Edit only `Your text here`. Do not delete the `<` or `>` brackets or the class names.

> [!NOTE]
> **RULE 4: Curly Brackets `{...}` Are Live Sensor Wires**  
> When you see `{dealerConfig.dealerName}`, that is a live electrical connection pulling data directly from `dealer.ts`. Leave the curly braces intact unless you want to replace the variable with static text.

---

## 8. Part 5: Adding or Replacing Images & Photos

A picture is worth a thousand words—especially a high-resolution photo of clean valvetrains or AMSOIL Signature Series cases in your shop.

### Where Images Live:

All site images are stored in the [`public/images/`](../public/images/) folder.

### Step-by-Step: Adding a New Photo:

1. **Choose Your Image**: Use a standard `.jpg`, `.png`, or `.webp` image.
2. **File Naming Rules**:
   - Use all **lowercase letters** and **hyphens** instead of spaces.
   - ✅ `brandon-shop-bay.jpg`
   - ❌ `Brandon's Shop Bay 2026!.JPG` _(Spaces and special characters cause broken links on web servers)._
3. **Move the Image File**:
   Copy your image file into the `brandonamsoil/public/images/` directory.
4. **Reference the Image in Code**:
   In any `.astro` page or component, reference the photo starting from `/images/...`:
   ```html
   <img
     src="/images/brandon-shop-bay.jpg"
     alt="Brandon's Automotive Repair Shop and AMSOIL inventory"
     class="rounded-xl shadow-lg w-full max-w-lg"
   />
   ```
5. Save the file (`Ctrl + S`) and view your new photo live on `http://localhost:4321`.

---

## 9. Part 6: Saving & Publishing with Git (The Service Log Pipeline)

Once you verify your changes look perfect on your local test bench (`localhost:4321`), follow this 3-step sign-off process to record your work and publish it to the live internet.

```
                  [The 3-Step Service Log Pipeline]
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│ 1. Stage Parts   │─────────►│ 2. Sign Off R.O. │─────────►│ 3. Release to Hwy│
│   (git add .)    │          │  (git commit -m) │          │   (git push)     │
└──────────────────┘          └──────────────────┘          └──────────────────┘
```

### Step 1: Stage Your Changes (Bagging & Tagging the Parts)

In the VS Code terminal, run:

```bash
git add .
```

_(The dot `.` tells Git to stage all modified files, including any newly added photos or pages, so nothing is left on the garage floor)._

You can run `git status` anytime to see your staged files highlighted in green!

### Step 2: Stamp the Repair Order (Commit)

Sign off on your changes with a clear summary of what work was performed:

```bash
git commit -m "Updated shop phone number and revised mechanic bio in about page"
```

### Step 3: Release to the Highway (Push & Auto-Deploy)

Send your verified work to the cloud repository:

```bash
git push
```

#### What Happens When You Run `git push`?

1. Your commit is uploaded to GitHub.
2. **Automated Assembly Line**: Cloudflare Workers detects the new commit within 15 seconds, compiles the Astro crate engine, and deploys the new static files across hundreds of edge data centers worldwide.
3. **Live Verification**: Within 60 to 90 seconds, visit the live production URL on your phone or computer:
   **`https://syntheticperformanceusa.com/`**  
   Your updates are now live for customers across the nation!

---

## 10. Part 7: The Mechanic's Diagnostic Tree (Troubleshooting)

When an engine won't fire, you don't panic—you follow the diagnostic tree:

```
                      [Diagnostic Tree Flowchart]
                       Is localhost:4321 loading?
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
                   [YES]                       [NO]
                     │                           │
          Did your changes appear?       Is terminal displaying
               ┌─────┴─────┐             red error text?
               ▼           ▼                   ┌─┴─┐
             [YES]       [NO]                  ▼   ▼
           All Good!  Perform Hard           [YES] [NO]
                      Refresh (Ctrl+F5)        │    │
                                      Read Line#   Zombie Process
                                      in Error     Port 4321 in use
```

---

### Diagnostic 1: "Address already in use: Port 4321" (Zombie Process)

- **Symptom**: When running `npm run dev`, the terminal warns `Port 4321 is in use`.
- **Cause**: An earlier development server was left running as an orphan in the background (like leaving the ignition key in the "Run" position).
- **Immediate Fix**:
  - **Option A**: Astro will prompt `Use port 4322 instead? (y/n)`. Press **`y`** and hit **`Enter`**. Then open `http://localhost:4322` in your browser.
  - **Option B (The Master Battery Disconnect)**: Kill the runaway background Node process:
    - **Windows**: Open PowerShell and run:
      ```powershell
      taskkill /F /IM node.exe
      ```
    - **Mac**: Open Terminal and run:
      ```bash
      killall node
      ```
      Then run `npm run dev` again cleanly.

---

### Diagnostic 2: Red Error Screen in Browser or Terminal (Syntax Error)

- **Symptom**: The browser displays a dark red banner with an error message, or the terminal halts with `SyntaxError: Unexpected token`.
- **Cause**: A cross-threaded code bolt. An extra quote, a deleted bracket (`<` or `>`), or a curved "smart quote" was accidentally entered.
- **How to Read the Error**: Look closely at the error message—it pinpoints the exact file and line number:
  ```text
  [error] /src/pages/about.astro:34:12: Unexpected token
  ```
- **Fix**:
  1. Open [`src/pages/about.astro`](../src/pages/about.astro).
  2. Look at line 34 (VS Code shows line numbers on the left edge).
  3. Check for an unclosed quote (`"`), an unclosed tag (`</p>`), or an extra character.
  4. Correct the character, press `Ctrl + S` to save, and the red error screen will vanish immediately.

---

### Diagnostic 3: You Saved the File, but Browser Text Didn't Update

- **Cause**: Your web browser cached the old page assets in its temporary memory.
- **Fix**: Force a **Hard Refresh** (bypassing browser cache):
  - **Windows (Chrome, Edge, Firefox)**: Press **`Ctrl + F5`** (or `Ctrl + Shift + R`).
  - **Mac (Chrome, Safari, Firefox)**: Press **`Cmd + Shift + R`**.

---

### Diagnostic 4: "I Made a Total Mess and Want to Undo Everything"

- **Symptom**: You experimented with some edits, broke something, and want to revert the files back to the exact condition they were in before you started.
- **Fix**: Run:
  ```bash
  git restore .
  ```
  _(This wipes out all unsaved local changes across all files and restores the last clean commit. Like rolling the vehicle back to its pre-service baseline)._

---

### Diagnostic 5: "Total Engine Rebuild" (Reinstalling Dependencies)

- **Symptom**: An obscure package error occurs, or files inside `node_modules` were accidentally deleted.
- **Fix**: Delete the temporary parts bin and reinstall clean:
  - **Windows PowerShell**:
    ```powershell
    Remove-Item -Recurse -Force node_modules
    npm install
    ```
  - **Mac Terminal**:
    ```bash
    rm -rf node_modules
    npm install
    ```

---

## 11. Reference Library & Technical Glossary

Keep these official documentation links bookmarked for deeper reading:

| Concept                | What It Is                                               | Official Documentation & Learning Resources                                                                            |
| :--------------------- | :------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **HTML**               | The fundamental markup language of the web               | [MDN HTML Beginner Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML)                    |
| **CSS**                | Style rules that govern typography, colors, and layout   | [MDN CSS First Steps](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps)                                  |
| **JavaScript**         | The client-side programming language for interactivity   | [MDN JavaScript Basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps)                         |
| **How the Web Works**  | Comprehensive guide to clients, servers, and HTTP        | [MDN How the Web Works](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works) |
| **Astro Framework**    | The fast, content-first web framework powering this site | [Astro Official Documentation](https://docs.astro.build/)                                                              |
| **Tailwind CSS**       | The modern utility styling system used across the site   | [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)                                                          |
| **Node.js**            | The desktop runtime engine that powers the build tools   | [Node.js Official Documentation](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)                   |
| **npm / pnpm**         | Package managers that download and manage libraries      | [npm Documentation](https://docs.npmjs.com/) \| [pnpm Documentation](https://pnpm.io/)                                 |
| **Git & GitHub**       | Version control and cloud collaboration software         | [Git Reference Manual](https://git-scm.com/doc) \| [GitHub Quickstart](https://docs.github.com/en/get-started)         |
| **Visual Studio Code** | Microsoft's code editor for editing project files        | [VS Code Documentation](https://code.visualstudio.com/docs)                                                            |
| **Hot Reloading**      | Instant browser updates upon file save                   | [Vite Hot Module Replacement](https://vite.dev/guide/features.html#hot-module-replacement)                             |
| **Cloudflare Workers** | The edge network hosting and routing your live site      | [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)                                         |
