This project is a technical task to build a simple fleet dashboard.

### Scenario
A fictional vehicle rental company operates a fleet of vehicles across multiple branches. They currently have no visibility into their stock — the data sits in a spreadsheet and nobody can quickly answer basic questions like "how many vehicles are available right now?" or "which branch has the most vehicles in maintenance?"

Our job is to build a simple web-based dashboard that turns this data into something useful.

### Dataset
There is a CSV file (fleet_sample_data.csv) inside ./dataset folder containing approximately 100 rows of sample fleet data with the following columns:
- vehicle_id — unique identifier
- make — manufacturer (e.g. Ford, Vauxhall, Toyota)
- model — vehicle model
- year — year of registration
- fuel_type — petrol, diesel, electric, or hybrid
- mileage — current odometer reading
- branch — which branch the vehicle is assigned to
- status — one of: available, on_rent, or maintenance
- daily_rate — rental rate in £ per day
- last_service_date — date of most recent service

### The task - expected output
- Build a simple web dashboard that displays the fleet data in a useful way
- Include at least the following
    - A summary view showing: total vehicles, how many are available / on rent / in maintenance, and a breakdown by branch
    - A way to filter or search the data (e.g. by branch, status, fuel type, or similar)
    - One simple visualisation — a chart or graph of your choice (e.g. vehicles by status, mileage distribution, branch comparison)

### Write a short README
- What you built and why you made the technical choices you did
    - How you used the AI assistant — what it helped with, what didn't work, and what I(the user) had to fix or do myself
    - What you would you improve or add if you had more time
    

### Additional Requirements
- The filter/search should support at least two dimensions (e.g. branch and status together, or a text search combined with a dropdown). 
- Add one feature that is not listed above, something you think would be genuinely useful for a fleet manager looking at this data. This can be anything: a calculated metric, an alert, a second chart, a sort function, an export. Tell us why you chose it in the README.