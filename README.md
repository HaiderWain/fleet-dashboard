# Fleet dashboard

A small web dashboard for a fictional rental fleet. It loads vehicle rows from a CSV file, shows summary counts, multi-criteria filters, a bar chart, plain language insights for the current filter set, and a sortable vehicle table.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). To create a production build:

```bash
npm run build
npm run preview
```

## What is included

- **Summary**: Total vehicles, counts by status (available / on rent / maintenance), and counts by branch for the **full** loaded fleet.
- **Filters**: Branch, status, and fuel type together (all are applied at once), driving the chart, insights, and table.
- **Chart**: Bar chart with a toggle to break down the **filtered** fleet by status or by branch.
- **Insights**: Short bullets derived from the **filtered** set (utilization, availability, maintenance concentration by branch, highest average mileage by branch).
- **Table (BONUS FEATURE)**: Same filtered rows with **sortable columns**: click a header to sort. Click again to reverse order. Helps compare mileage, rates, and service dates without exporting to a spreadsheet first.

## Technical choices

- **Vite + React + TypeScript**: I chose this stack because it allows for fast development while keeping the code structured and easy to maintain.
    - Vite provides a very fast development environment, which made it quick to iterate and test ideas during the task. Alternatives like Create React App or Next.js were considered, but Vite is lighter and simpler for a small, single-page dashboard like this.
    - React was used to build the user interface in a modular way. It makes it easy to separate concerns (filters, table, chart, etc.) and update the UI dynamically as the data changes.
    - TypeScript adds type safety, which is particularly useful when working with structured data like CSV files. It helps prevent common errors and makes the code easier to debug and maintain.
    - I also have prior experience with this stack, which allowed me to implement it quickly and confidently while still ensuring quality.
- **Tailwind CSS**: Tailwind was used for styling because it allows for fast UI development without writing separate CSS files. This keeps everything consistent and easy to manage within the components..
- **Recharts**: I chose Recharts because its a as a simple and reliable charting library for React. It integrates well with the component based structure and requires minimal setup.
- **Client-side CSV**: The data is loaded and processed directly in the browser instead of using a backend service. This was a deliberate decision to keep the solution simple and focused on the core requirement which was turning raw data into useful insights.

## CSV files

- The assignment CSV lives in [`public/fleet_sample_data.csv`](public/fleet_sample_data.csv).
- The running app loads [`public/fleet_sample_data.csv`](public/fleet_sample_data.csv) from the dev server root (`fetch("/fleet_sample_data.csv")`). Vite serves everything under `public/` at the site root.
- If you edit the dataset for demos, copy the updated file into `public/` (or symlink) so the dashboard picks it up.

## Bonus feature: Sortable and Filterable Table

Fleet managers routinely scan for high-mileage units, expensive daily rates, or stale service dates. Sortable headers make those comparisons one click away and stay entirely in the browser, with no extra dependencies.
The filters used for the bar chart, are also applied to this table. So instead of applying filters at the csv file, you can use the filters here and see the table in the demo changing live.

## How I used an AI assistant
I used Cursor as my primary AI coding assistant throughout the project, focusing on guiding it rather than relying on it blindly.

To set up a good foundation, I created a **.cursor/rules** directory and added a rules file to encourage consistent, clean frontend patterns. I also converted the provided HTML requirements into a structured Markdown file (docs/requirements.md), which made it easier for the AI to read and follow.

Instead of jumping straight into implementation, I first prompted Cursor to analyse the requirements, dataset, and rules, and help plan the approach. This led to a clear initial direction (using Vite, React, and a simple client-side architecture), which helped avoid unnecessary complexity later.

For the initial implementation, Cursor generated most of the base structure (components, data handling, and layout). Given the scope of the task, the first iteration was already close to what was needed.

From there, I focused on validation and refinement:
- I tested the application in the browser to ensure filters, chart, and table behaved correctly
- I reviewed the codebase and especially the CSV parsing logic to confirm it handled the dataset reliably
- I improved the user experience of the sortable table, as the clickable headers were not initially obvious. This required manual adjustments beyond the AI generated output

Overall, AI significantly sped up development, especially for scaffolding and repetitive patterns. However, I treated it as a collaborative tool, verifying outputs, making corrections where needed, and refining the user experience manually.

## If I had more time
- Introduce a backend and database
    - Currently, the data is processed entirely in the browser for simplicity. In a real-world system, I would introduce a backend service (e.g. Node.js or Python) with a database to store and manage fleet data. This would allow for real-time updates, better data integrity, and support for larger datasets across multiple branches.
- Data pipeline (replacing manual CSV files)
    - Instead of relying on static CSV files, I would build a pipeline to automatically take data from operational systems (e.g. vehicle tracking tools). This would ensure the dashboard always reflects up-to-date information without manual intervention.
- More advanced analytics and insights
    - I would expand the insights section to provide more business value, such as Revenue projection, vechile utilisation, and more. This type of data is more useful towards business goals.
- Improved data validation
    - While the current CSV is clean, real world data is often inconsistent. I would add stronger validation and error handling to deal with missing or corrupted data.
- Authentication and role-based access
    - If used internally, different users (e.g. managers vs staff) may need different views or permissions. Adding authentication would make the system more secure and practical.
