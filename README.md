## TeaPP

Welcome to TeaPP.

TeaPP is a software prototype for the digitalisation, management , analysis and
visualisation of tea plant breeding data in partnership with
Brown/Lipton as the requirements of a Thesis Project at Cranfield
University.

<img src="media/media/image1.png"
style="width:3.74627in;height:1.93569in" />

Deployment and login access to TeaPP is available on request. Please
contact Jenny, (jenny.ohalloran@cranfield.ac.uk) with any enquiries or
questions. 

### Overview

TeaPP implemented a custom upload, analysis and visualisation pipeline
for the Brown/Lipton dataset as detailed below.
![](media/media/overview.png)

This includes:

1)  Data Cleaning and Formating before uploading.

2)  Pedigree Summary and Descriptive Statistics

3)  Interactive Pedigree Visulisation Tool

4)  Kinship Analysis

5)  Administrative Tools

6)  Environmental Analysis

7)  Sequencing Analysis

8)  Future integration of Phenotypic data and analysis

<!-- -->

### Accessing the Application on AWS

For each instance deployment of TeaPP there will be a unique IP address
assigned to the application (e.g. 3.10.54.41).

The application is accessed via a web-browser and requires a stable
internet connection.

Steps to access and login into TeaPP (see Figure M 1):

1)  & 2) Enter the IP address into your preferred browsers search bar.

2)  Enter your username and password

3)  Click Sign In

4)  If your login details are correct your will be navigated to the
    TeaPP Landing Page.

<figure>
<img src="media/media/image2.png" style="width:5.46458in;height:4.8in"
alt="Figure M 1: User Login steps." />
<figcaption aria-hidden="true">Figure M 1: User Login
steps.</figcaption>
</figure>

<!-- -->

### Landing Page

After login in the “Landing Page” is displayed.

From the here you can (Figure M2):

1.  Uploading new data.

2.  Analysing Existing Data

3.  Empty existing data from Databases

From the drop-down menu you can navigate to other pages within TeaPP.

<figure>
<img src="media/media/image3.png"
style="width:7.11111in;height:4.1125in"
alt="Figure M 2: The Landing Page. This is the first page in the User Trajectory (Figure 18). Here the user can select to upload (1), analyse existing (2) or delete data (3) from the databases. The top bar contains features accessible from all pages in TeaPP. The user can also navigate the rest of the application via the “Menu” dropdown, which will route the display to the respective page. The “help” pop-out can help accessed via the “?” icon or the Menu and displays instructions and prompts to the user." />
<figcaption aria-hidden="true">Figure M 2: The Landing Page. This is the
first page in the User Trajectory (Figure 18). Here the user can select
to upload (1), analyse existing (2) or delete data (3) from the
databases. The top bar contains features accessible from all pages in
TeaPP. The user can also navigate the rest of the application via the
“Menu” dropdown, which will route the display to the respective page.
The “help” pop-out can help accessed via the “?” icon or the Menu and
displays instructions and prompts to the user.</figcaption>
</figure>

Additional help can be found in the help-tab be selecting the “help”
dropdown or “?” icon.

### Home Page

This is the central page to explore the pedigree dataset currently
loaded in TeaPP. Here the user can move between six key features using
the respective tabs .

- Pedigree Summary Statistics

- Pedigree Visualisation

- Kinship Analysis

- Environmental Analysis

- Genomic Analysis

- Administrative Tools

<figure>
<img src="media/media/image4.png"
style="width:7.58204in;height:2.92083in"
alt="Figure M 3: The Home Page. The tab specifying each other implemented analysis and management features currently available in TeaPP, including an overview of Summary &amp; Descriptive Statistics (default view), Database Management &amp; Status, Pedigree Visualisation, and Kinship, Environment and Genomic Analysis respectively. The user can navigate through these by selecting each. The current user is display in the top-right corner (green box), whilst “dataset” sits as a pacemaker for the future development of a multi-dataset management system, where the current selected dataset is displayed." />
<figcaption aria-hidden="true">Figure M 3: The Home Page. The tab
specifying each other implemented analysis and management features
currently available in TeaPP, including an overview of Summary &amp;
Descriptive Statistics (default view), Database Management &amp; Status,
Pedigree Visualisation, and Kinship, Environment and Genomic Analysis
respectively. The user can navigate through these by selecting each. The
current user is display in the top-right corner (green box), whilst
“dataset” sits as a pacemaker for the future development of a
multi-dataset management system, where the current selected dataset is
displayed.</figcaption>
</figure>

######## Administrative Tools

Administrative functionalities can be accessed via the “Admin Tools”
tab.

**<u>Database Management</u>**

Here the user can (Figure M7):

- View (1) PostgresSQL and (2) Neo4j database status respectively

  - Each database’s status is indicated by a “live” or “offline” status
    (highlighted by orange box).

- Refresh database status tables (3).

- Restart the connection to each respective database (4).

If either database is highlighted as “offline” it is recommended to
restart the database to ensure all analytic features and data upload can
function successfully.

<figure>
<img src="media/media/image6.svg"
style="width:5.90556in;height:3.86806in"
alt="Figure M 4: Admin Tools Page. (1) Summaries of the PostgreSQL database and (2) Neo4j Database. (3) The “Refresh button” allows you to get updated summares for both databases. (4) Selecting the respective “restart” buttons for each database allows you to restart the database and connection, resulting in a pop-out detailing the success/ failure to restart that database." />
<figcaption aria-hidden="true">Figure M 4: Admin Tools Page. (1)
Summaries of the PostgreSQL database and (2) Neo4j Database. (3) The
“Refresh button” allows you to get updated summares for both databases.
(4) Selecting the respective “restart” buttons for each database allows
you to restart the database and connection, resulting in a pop-out
detailing the success/ failure to restart that database.</figcaption>
</figure>

**<u>Search feature</u>**

The user can search database to find partially matching entries to a
search term (Figure M 5).

Instructions for Searching :

1.  Enter search term into Search bar

2.  Click “Search”.

3.  The page will show a loading screen, and if matching results are
    returned tables will be displayed (Figure M 8(2&4)).

4.  The PostgreSQL can be expanded to view individual entries that have
    been aggregated by year-wide-siblings.

<figure>
<img src="media/media/image8.svg"
style="width:5.90556in;height:3.72014in"
alt="Figure M 5: Database Search Feature – Database Status Page. (1) The Search bar for the user to input of a specific Clone ID. (2) and (4) shows matching entries from PostgreSQL and Neo4j respectively. Orange boxes hiighlight the matching attributes for the entries. (3) Drop down for the entries that have been aggregated for the PostgreSQL database due to grouping my sibling." />
<figcaption aria-hidden="true">Figure M 5: Database Search Feature –
Database Status Page. (1) The Search bar for the user to input of a
specific Clone ID. (2) and (4) shows matching entries from PostgreSQL
and Neo4j respectively. Orange boxes hiighlight the matching attributes
for the entries. (3) Drop down for the entries that have been aggregated
for the PostgreSQL database due to grouping my sibling.</figcaption>
</figure>

### Pedigree Data

Pedigree data detailing the breeding population can be uploaded,
analysed and visualised within TeaPP.

### Pedigree Upload.

Within the upload page the user can navigate to the “Pedigree Data” tab
to start uploading their data file.

<figure>
<img src="media/media/image10.svg"
style="width:3.95278in;height:4.87986in"
alt="Figure M 6: Pedigree Upload GUI. (1) The “Pedigree Data” tab where the user can (2) view the “Help” menu to see the file specifics, (3) choose the file from their local directory, and (4) start uploding the file after intial checks and statistics are displayed." />
<figcaption aria-hidden="true">Figure M 6: Pedigree Upload GUI. (1) The
“Pedigree Data” tab where the user can (2) view the “Help” menu to see
the file specifics, (3) choose the file from their local directory, and
(4) start uploding the file after intial checks and statistics are
displayed.</figcaption>
</figure>

Steps to upload a pedigree dataset (Figure M 6) :

1)  Select the “Pedigree Data” tab in the Upload Page display

2)  The “Help” drop-down displays useful information regarding file
    specifics, including file type, column names.

<img src="media/media/image11.png"
style="width:3.14in;height:1.49394in" />

3)  Click “Choose file” to select the pedigree data file from your local
    directory.

4)  After the file type is checked, the file statistics are displayed
    before the user for choose to start uploading the file via the
    “Upload” button.

The uploaded pedigree data can be manually reviewed to ensure pedigree
integrity before storage. “Invalid” Clone IDs, those that don’t match
the Brown/Lipton nomenclature, are flagged and displayed to the user to
view.

Pedigree validation page includes (Figure M 7):

1)  **Invalid offspring manual formatting**

> This allows the user to manually reformat or remove offspring records
> in the dataset where its “ID” does not match the Brown/Lipton
> nomeclature.

2)  **Invalid parental removal or updating**

> This allows the user to manually reformat parental records in the
> dataset where its “ID” does not match the Brown/Lipton nomeclature.

3)  **Use the Search feature**

> This allows the user to manually search against their uploaded dataset
> to reformat clone IDs based existing entries to ensure they match, and
> the lineage integrity is retained.

<figure>

<img src="media/media/image12.png"
style="width:6.91181in;height:6.01875in"
alt="Screens screenshot of a computer AI-generated content may be incorrect." />
<figcaption>

<p>

Figure M 7: Components of the Invalid Records table displayed after the
integrated pedigree data (1) The invalid offspring records for display
and review, followed by the (2) Invalid Parents or Founders identified
for reformatting. (3) The use can utilised the search feature to look up
entries within their uploaded dataset to make manual cross-comparisons
to ensure the records are matching.
</p>

</figcaption>

</figure>

### Assessing Invalid Offspring

The invalid offspring, those bred resulting from the breeding programme
that do not match the nomeclature are highlighted in the displayed
table.

<img src="media/media/image14.svg"
style="width:5.90556in;height:3.34375in" />Figure M 8: Invalid Offspring
GUI. The user can manually reformat the Clone IDs of the invalid
offspring (1) or select them for removal (2). (3) Option to select all
those in the list or (4) only offspring that have not been used as
active breeders in the population based on their ID. (5) Then the user
can proceed to reviewing the invalid parental records.

The user can follow these steps to update the clone IDs (Figure M 8):

1)  The user can manually type in the reformatted Clone ID into the
    corresponding input bar.

2)  Entries for removal can be selected via the “Remove” column by click
    the check-box. This highlights the entry in red.

3)  Optionally the user can click “Select all to remove” – this will
    highlight all entries displayed to be removed.

4)  Alternatively, “Select all unused” allows the user to select only
    those that are not used as breeding parents in the dataset.

5)  “Next” moves the GUI to the next reviewing page for the user to
    review invalid parents/founders. The reformatted entries are not
    uploaded until after this step.

### Assessing Invalid Parents/Founders

The invalid parental records, those that have been used as parents but
do not correspond to an offspring records, therefore are potential
founders, can be reviewed.

<figure>
<img src="media/media/image16.svg"
style="width:5.90556in;height:3.78125in"
alt="Figure M 9: GUI displaying invalid parental records. These parental entries do not match a record within the dataset, so are flagged as founders or erroneous. The user can choose to (1) Manually reformat the clone ID and (2) check that is corresponds to an entry before (3) finalising the uploading of the data to TeaPP." />
<figcaption aria-hidden="true">Figure M 9: GUI displaying invalid
parental records. These parental entries do not match a record within
the dataset, so are flagged as founders or erroneous. The user can
choose to (1) Manually reformat the clone ID and (2) check that is
corresponds to an entry before (3) finalising the uploading of the data
to TeaPP.</figcaption>
</figure>

The user can review parental records by (Figure M 9):

1)  Manually reformatting the clone ID of the record.

2)  “Update” allows the user to send the reviewed entries for comparison
    against the dataset. If any of the reformatted entries
    correspond/match parental records present in the dataset then
    dataset and list are updated accordingly. The new list is displayed
    to the user.

3)  “Upload” confirms the reviewing and formatting of both invalid
    offspring and parental records. This starts the final processing and
    uploading pipeline.

4)  After the data upload is finalised, the user is redirected to the
    Home Page of TeaPP to start data analysis and exploration.

### Pedigree Summary & Descriptive Statistics

Upon reaching the Home Page, TeaPP calculates summary statistics for the
uploaded pedigree data (Figure M10). This includes descriptive
statistics and metrics detailing characteristics such as the frequency
of offspring per generation, year, or the number of twins identified.

<figure>

<img src="media/media/image17.png"
style="width:5.90556in;height:1.87431in"
alt="Figure M 10: Summary & Descriptive Statistics Page. A selection of
descriptive metrics are calculated and displayed to the user regarding
the uploaded pedigree data. These inlcude plants per generation, twin
and sibling frequencies, plants bred per year. Summary venn diagrams and
an interactive HTML histogram of plants bred per year and are displayed." />
<figcaption>


</figcaption>

</figure>

### Pedigree Visualisation

Upon successful upload and storage of the plant pedigree data,
visualisation of the data can be achieved in the “Pedigree
Visualisation” tab of the Home-Page.

The “Pedigree Visualisation” tab

<figure>
<img src="media/media/image19.svg"
style="width:5.90556in;height:4.29645in"
alt="Figure M 11: Pedigree Visualisation Page" />
<figcaption aria-hidden="true">Figure M 11: Pedigree Visualisation
Page</figcaption>
</figure>

(1)The default visualisation for a pedigree dataset appears in the top
container. One a node is selected/ searched a secondary pedigree
detailing the respective linear pedigree family is displayed in the
bottom container (2). The side panels contain (3) Zoom In/Out controls,
(4) Pedigree layout parameters, (5) Plant Search Bar, (6) Basic
Statistics on the Secondary diagram. (7) The node colour legend for
displayed graph.

#### Pedigree Layout Parameters

The top container, displaying the entire pedigree dataset can be
modified via the selection of a range of parameters.

<u>Filtered:</u>

> If selected, the nodes are filtered by use as a breeding individual.
> Plants that do not have descendants of a higher generation (children)
> are removed, unless they are of the most recent generation, then they
> are retained.

<u>Layer By:</u>

> **Year** - Nodes are layered ascending (earliest to latest) order of
> their cross “year” as determined by the Brown/Lipton nomenclature.
> “Founders” are manually layered at the top.
>
> **Generation** – Nodes are layered by their assigned “generation”
> (Synbreed - (Wimmer et al., 2012) in ascending order (oldest to
> youngest).

<u>Group By:</u>

> **Siblings** – Plants that are year-wide-siblings (same parents, same
> year) are aggregated as represented as a single node.
>
> **None** – All nodes that present are represented individually.

<u>Colour:</u>

> **Year** - Nodes are coloured ascending (earliest to latest) order of
> their cross “year” as determined by the Brown/Lipton nomenclature.
>
> **Generation** – Nodes are coloured by their assigned “generation”
> (Synbreed - (Wimmer et al., 2012)).

<u>Node Size:</u>

> **No. of Descendant’s** – The node’s size is scaled to the number of
> identified descendants within the population.
>
> **None** – Nodes remain the uniform default size.

The “default” visualisation is set to be filtered, grouped by siblings,
layered by year, coloured by generation and no node scaling.

To change the pedigree layout:

<img src="media/media/image20.png"
style="width:0.94827in;height:2.21429in" />

1)  Selected your chosen parameters by selecting the respective radio
    buttons.

2)  Click “update” (Figure M 11 – 4- green arrow).

3)  This will display a loading screen while the graph is loading.

4)  The updated graph will be displayed in the top container for
    interactive exploration.

#### Node Selection & Searching

<img src="media/media/image21.png"
style="width:1.54375in;height:1.07083in" />

A specific node of interest can be selected from the top container
(Figure M 11– 1) or searched to display its linear pedigree (bottom
container) (Figure M 11 – 2 & 5).

Follow these steps to display a linear pedigree visualisation:

1)  The node can be selected the top pedigree visualisation (Figure
    M 11) via clicking on the desired node, or by using the search
    feature to find and select a plant via its Clone ID.

2)  After selection the bottom visualisation with load the respective
    pedigree graph (Figure M 12).

Figure M 12 shows an exemplar linear pedigree graph. Colours are adopted
from the parameters set in the Primary pedigree visualisation. (e.g.
year or generation). Node size is automatically scaled to show number of
descendants.

<figure>

<img src="media/media/image22.png"
style="width:5.90556in;height:1.55208in"
alt="" />
<figcaption>

<p>

Figure M 12: Close up of secondary linear pedigree visualisation. The
select individuals (either singular or group of siblings) are
highlighted in bright orange.
</p>

</figcaption>

</figure>

### Kinship Analysis

Calculation of a kinship matrix can be performed by selecting the
“Kinship Analysis” tab.

The follow these steps (Figure M 13).:

1.  You can choose to ether retrieve a previously performed and stored
    version of the kinship matrix and plots

2.  Calculation a new kinship matrix. An email can be provided to send
    notifications for the end of the analysis pipeline.

3.  If your environment does not meet the computational requirements,
    the analysis cannot be performed, and an alert will be displayed.

4.  If the kinship matrix calculation and visualisation is successful,
    the respective plots will be displayed to the user.

<img src="media/media/image23.png"
style="width:5.90556in;height:1.55208in"
alt="Figure M 13: Kinship Analysis Page.

The user can either select to view the stored results of a kinship
analysis (1)(implemented due to computational memory requirements of
Synbreed Kinship matrix calculation or perform a new Kinship Matrix
calculation (2) if the system performance permits. (3) An alert
implemented to warn of the lack of RAM storage requirements that
prevents TeaPP from performing the Kinship Matrix. This displays the
users current RAM against the 64GB threshold. (4) Exemplar plots
following successful kinship matrix calculation and
visualisation" />
<figcaption>
    
<figure>
<img src="media/media/image22.svg"
style="width:5.90556in;height:3.86806in"
alt="" />
<figcaption aria-hidden="true">Figure M 13: Kinship Analysis Page.

The user can either select to view the stored results of a kinship
analysis (1)(implemented due to computational memory requirements of
Synbreed Kinship matrix calculation or perform a new Kinship Matrix
calculation (2) if the system performance permits. (3) An alert
implemented to warn of the lack of RAM storage requirements that
prevents TeaPP from performing the Kinship Matrix. This displays the
users current RAM against the 64GB threshold. (4) Exemplar plots
following successful kinship matrix calculation and
visualisation</figcaption>
</figure>

### Environmental Data

Contextual environmental data can be uploaded for analysis and
exploration. This currently includes:

- Temperature Records (mean °C/month)

- Rainfall Records (mean mm/month)

#### Uploading Environmental Data

<figure>

<img src="media/media/image25.png"
style="width:7.74318in;height:5.14634in"
alt="" />
<figcaption>

<p>

Figure M 14: Environmental File upload page. (1) Selecting the
Environmental Data table, (2) The pop-down “Help” tab detailing upload
instructions, (3) Select “choose file” to choose a file from your local
directory. (4) Select the data-type you are uploading – Rainfall or
Temperature. (5) Start upload of the file by clicking “Start Upload”.
</p>

</figcaption>

</figure>

Environmental files (rainfall/temperature records) can be uploaded by
navigating to the Upload Page and following these steps (see Figure M
14):

1)  Select the ’Environmental” tab of the upload display section.

2)  Ensure your data meets the required format specified in the “Help”
    dropdown. This includes:

- Tab-deliminated text file (.txt)

- The file headers as defined and must be formatted in the same manner:

Temperature:

<img src="media/media/image26.png"
style="width:5.90556in;height:0.70694in" />

Rainfall:

<img src="media/media/image27.png"
style="width:5.90556in;height:0.71042in" />

3)  Your chosen text file can be selected from your local directory.

4)  If they meet the required text file format requirements, you must
    specify the environmental data type: “Temperature” or “Rainfall”.

5)  Selecting “Start Upload” to beginning the uploading of the files to
    TeaPP.

6)  An alert will appear if successful, and you will be navigated to the
    Home Page.

### Environmental Analysis

Currently, the user can select between performing analysis and data
visualisation of Temperature (1) and Rainfall (2) data (Figure M 15).

Selecting either analysis options results in the calculation of data
visualisation plot for the respective data-type (3). You can interact
with the plots to display specific metric for points on the plot, zoom,
or pan around the graph.

<figure>
<img src="media/media/image29.svg"
style="width:5.90556in;height:3.26667in"
alt="Figure M 15: a) GUI implemented to allow for user to select either Temperature (1) or Rainfall (2) data that has been uploaded to TeaPP." />
<figcaption aria-hidden="true">Figure M 15: a) GUI implemented to allow
for user to select either Temperature (1) or Rainfall (2) data that has
been uploaded to TeaPP.</figcaption>
</figure>

### Genomic Data

Genomic data can be uploaded for storage and analysis.

\*\* This is not currently linked or synchronous to
pedigree/environmental records, instead is a place-holder for future
NGS/GS data\*\*\*

### Uploading Genomic Files

<figure>
<img src="media/media/image30.png"
style="width:5.90556in;height:4.62778in"
alt="Figure M 16: Genomic File Upload Page. GUI for genomic upload page. (1) Selection of “genomic data” tab. (2) Drop-down “Help” displays file requirements. (3) Option to open local directory to choose a file(s) to upload. (4) Entering the Clone ID of the respective files you have chosen. (5) Upload button to begin the processing of the files." />
<figcaption aria-hidden="true">Figure M 16: Genomic File Upload Page.
GUI for genomic upload page. (1) Selection of “genomic data” tab. (2)
Drop-down “Help” displays file requirements. (3) Option to open local
directory to choose a file(s) to upload. (4) Entering the Clone ID of
the respective files you have chosen. (5) Upload button to begin the
processing of the files.</figcaption>
</figure>

Genomic files can be uploaded by navigating to the Upload Page and
selecting the “Genomic Data” tab (Figure M16)

Genomic files can be uploaded by navigating to the Upload Page and
following these steps (see Figure M 16):

7)  Select the “Genomic Data” tab of the upload display section.

8)  Ensure your data meets the required format specified in the “Help”
    dropdown. This includes:

- Fastq file

- Ending in either .fastq or .fq

- Maximum 10GB file size

- Multiple files can be uploaded at once but must be related to the same
  Clone (as names in Clone ID).

9)  Select your chosen Fastq file(s) from your local directory.

10) If they meet the required FastQ format, you can specify the Clone ID
    that the genomic files are related to.

**\*\*\*** All file uploaded together must be related to the same
individual**\*\*\***

11) Selecting “Start Upload” to beginning the uploading of the files to
    TeaPP.

12) An alert will appear if successful, asking if you would like to
    upload another file.

You can now navigate to the Home Page to start the analysis of the
Genomic records.

### Genomic Analysis

On selection of the Genetic data analysis tab, the user can view and
select genomic records to perform FastQC analysis (Andrews, 2012)
following these steps (see Figure M 17):

1)  Uploaded genomic files are displayed in the table

2)  The user can select which genomic file to perform FastQC.

3)  Next the user can select to perform FastQC on the selected files or
    display all stored FastQC records.

4)  After FastQC is performed for all selected files, or have been
    retrieved, they are listed below as links.

5)  The user can select a chosen FastQC report and click to view it as a
    HTML in an additional tab.

<figure>

<img src="media/media/image31.png"
style="width:7.28919in;height:6.95833in"
alt="Screens screenshot of a computer AI-generated content may be incorrect." />
<figcaption>

<p>

Figure M 17: Genetic Data Analysis Page.
</p>

</figcaption>

</figure>

This page displays the stored genomic data (1) for the user to select
for FastQC analysis (2). (3)The user can supply an email to receive
optional notifications of the successful start and end of the analysis
pipeline. Successful FastQC report are listed below after completion for
the user to select and open in an external browser tab (4).

### Profile & Settings

From the landing, upload and home page the user can access the profile
page. This currently acts as a placeholder for future functionality to
customise the GUI and manage user settings (Figure M 18).

<figure>
<img src="media/media/image32.png"
style="width:6.83542in;height:3.82847in"
alt="Figure M 18: Profile and Setting Page. Implemented as a placeholder for future user profile management. Orange box highlights the current user displayed (provided by Apache2 ((Behlendorf et al., 1999))). All other features are non-functional but indicate potential features such as GUI display themes and customisable pedigree visualisation colours." />
<figcaption aria-hidden="true">Figure M 18: Profile and Setting Page.
Implemented as a placeholder for future user profile management. Orange
box highlights the current user displayed (provided by Apache2
((Behlendorf et al., 1999))). All other features are non-functional but
indicate potential features such as GUI display themes and customisable
pedigree visualisation colours.</figcaption>
</figure>

## 
