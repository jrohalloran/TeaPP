

## Jennifer O'Halloran

## 25/06/25

## Thesis Project: TeaPP Visualisation App Prototype 



cat("✅ R script started...\n")

library(jsonlite)
library(ggplot2)




args <- commandArgs(trailingOnly = TRUE)

if (length(args) < 2) {
  stop("Not enough arguments. Expecting data file path and script directory.")
}
    # Path to the JSON file
script_dir <- args[2]  
json_file <- args[1]


cat("Script directory:", script_dir, "\n")

controller_dir <- dirname(script_dir)
print(controller_dir);

backend_dir <- dirname(controller_dir)
print(backend_dir);


# Define the adjacent folder name (e.g., "data")
upload_subfolder <- "uploads"

temp_subfolder <- "temp"

# Construct the full path
uploads_dir <- file.path(backend_dir,upload_subfolder)
temp_dir <- file.path(controller_dir, temp_subfolder)

message("Uploads Directory: ", uploads_dir)
message("Temp Directory: ", temp_dir)
message("Working directory set to: ", getwd())

setwd(temp_dir)
cat("Working directory set to:", getwd(), "\n")

# Parse JSON into a data frame
df <- fromJSON(json_file)

# View the data as a proper data frame (datagram)
#head(df)


## ************ Exploration ********


# ----------------  Analysing Twins -----------------

## Removal of twins - how many are left?

## ------ NUMBER OF TWINS - TWIN NO.2
matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$correct_id)
# Get matching rows
matching_df <- df[matched_rows, ]
#nrow(matching_df)


#### -------- TWIN NO.2 AS PARENTS
## Checking Twins ending in letter + "2" aren't used as parents 
matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$correct_id)
# Get matching rows
matching_df <- df[matched_rows, ]
#nrow(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$clone_id)
# Get matching rows
matching_df <- df[matched_rows, ]
#nrow(matching_df)
#print(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$correct_male)
# Get matching rows
matching_df <- df[matched_rows, ]
#nrow(matching_df)


matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$correct_female)
# Get matching rows
matching_df <- df[matched_rows, ]
#nrow(matching_df)

## ------ NUMBER OF TWINS - TWIN NO.1
matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$correct_id)
# Get matching rows
matching_df <- df[matched_rows, ]
#nrow(matching_df) 


matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$clone_id)
# Get matching rows
matching_df <- df[matched_rows, ]
#nrow(matching_df) 
#print(matching_df)

#### -------- NO PARENTS ARE TWINS 
## Checking Twins ending in letter + "1" aren't used as parents 
matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$correct_female)
# Get matching rows
matching_df <- df[matched_rows, ]
#nrow(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$correct_male)
# Get matching rows
matching_df <- df[matched_rows, ]
#nrow(matching_df)



# Initialize an empty data frame to store results
results <- data.frame(
  Description = character(),
  Count = integer(),
  stringsAsFactors = FALSE
)

# Twin No.1
matched_rows <- grepl("^\\d{6,7}([a-zA-Z/])1$", df$correct_id)
results <- rbind(results, data.frame(Description = "Twin No.1 IDs", Count = sum(matched_rows)))

matched_rows <- grepl("^\\d{6,7}([a-zA-Z/])1$", df$correct_male)
results <- rbind(results, data.frame(Description = "Twin No.1 used as father", Count = sum(matched_rows)))

matched_rows <- grepl("^\\d{6,7}([a-zA-Z/])1$", df$correct_female)
results <- rbind(results, data.frame(Description = "Twin No.1 used as mother", Count = sum(matched_rows)))

# Twin No.2
matched_rows <- grepl("^\\d{6,7}([a-zA-Z/])2$", df$correct_id)
results <- rbind(results, data.frame(Description = "Twin No.2 IDs", Count = sum(matched_rows)))

matched_rows <- grepl("^\\d{6,7}([a-zA-Z/])2$", df$correct_male)
results <- rbind(results, data.frame(Description = "Twin No.2 used as father", Count = sum(matched_rows)))

matched_rows <- grepl("^\\d{6,7}([a-zA-Z/])2$", df$correct_female)
results <- rbind(results, data.frame(Description = "Twin No.2 used as mother", Count = sum(matched_rows)))

# Save to text file
file<- paste0(temp_dir,"/twin_check_summary.txt")
write.table(results, file, sep = "\t", row.names = FALSE, quote = FALSE)




male <- as.character(df$correct_female)
female <- as.character(df$correct_male)
# Combine both columns
all_parents <- c(male, female)

# Checking how many entries have parents that are clones with siblings 

pattern <- "^\\d{7}([a-zA-Z]|/)$"
# Matching 7digit followed by letter OR /

matches <- grepl(pattern, df$correct_female) | grepl(pattern, df$correct_male)
matching_df <- df[matches, ]
nrow(matching_df)
# Getting number of individual parents 
matched_parents <- all_parents[grepl(pattern, all_parents)]
# How many times?
#length(matched_parents)
unique_matched_parents <- unique(matched_parents)
#length(unique_matched_parents)

# Checking if any of them are siblings themselves (same prefix)

# Extract the first 7 characters
prefixes <- substr(matched_parents, 1, 7)
#length(prefixes)
#length(unique(prefixes))


# Find duplicated prefixes
dup_prefixes <- unique(prefixes[duplicated(prefixes)])
#length(unique(dup_prefixes))

# Now find which elements correspond to each duplicated prefix
result <- lapply(dup_prefixes, function(p) matched_parents[prefixes == p])

all_matched <- unlist(result)

count_table <- table(unlist(result))

# Sort in decreasing order (highest count first)
ranked_counts <- sort(count_table, decreasing = TRUE)

#print(ranked_counts)

file<- paste0(temp_dir,"/ranked_counts.txt")

write.table(ranked_counts, file = file, sep = "\t", row.names = FALSE, quote = FALSE)


# Letters of interest
siblings <- c("A", "B", "C", "D", "E", "F")

# Initialize empty results list
results <- data.frame(
  Sibling = character(),
  Entry_Count = integer(),
  Unique_Parent_Count = integer(),
  stringsAsFactors = FALSE
)

# Loop over each sibling letter
for (s in siblings) {
  
  # Build pattern (case insensitive)
  pattern <- paste0("^\\d{7}[", s, tolower(s), "]\\d?$")
  
  # Find matches in Male or Female parent columns
  matches <- grepl(pattern, df$correct_female) | grepl(pattern, df$correct_male)
  entry_count <- sum(matches)
  
  # Find matching individual parents
  matched_parents <- all_parents[grepl(pattern, all_parents)]
  unique_parent_count <- length(unique(matched_parents))
  
  # Add to results
  results <- rbind(results, data.frame(
    Sibling = s,
    Entry_Count = entry_count,
    Unique_Parent_Count = unique_parent_count
  ))
}

# View the final summary table
#print(results)


file<- paste0(temp_dir,"/sibling_counts.txt")
write.table(results, file = file, sep = "\t", row.names = FALSE, quote = FALSE)

# Calculate values
num_female_unique <- length(unique(c(df$correct_female)))
num_male_unique <- length(unique(c(df$correct_male)))
num_intersect <- length(intersect(unique(c(df$correct_female)), unique(c(df$correct_male))))
num_female_not_male <- length(setdiff(unique(c(df$correct_female)), unique(c(df$correct_male))))
num_male_not_female <- length(setdiff(unique(c(df$correct_male)), unique(c(df$correct_female))))

parents <- unique(c(df$correct_male, df$correct_female))
num_parents <- length(parents)

# Create a data frame
summary_df <- data.frame(
  Metric = c(
    "Unique Parents",
    "Unique Female Parents",
    "Unique Male Parents",
    "Used as Both",
    "Female Only",
    "Male Only"
  ),
  Count = c(
    num_parents,
    num_female_unique,
    num_male_unique,
    num_intersect,
    num_female_not_male,
    num_male_not_female
  )
)

# Write to a tab-delimited file
file <- file.path(temp_dir, "summary_counts.tsv")
write.table(summary_df, file, sep = "\t", row.names = FALSE, quote = FALSE)


# Getting altering statistics 
# Get changed IDs


#print("setdiff, ID, correct_ID")
#print(length(unique(setdiff(df$clone_id, df$correct_id))))

#print("setdiff, female_par, correct_female")
#print(length(unique(setdiff(df$female_par, df$correct_female))))

#print("setdiff, male_par, correct_male")
#print(length(unique(setdiff(df$male_par, df$correct_male))))


num_id_updated<-length(unique(setdiff(df$clone_id, df$correct_id)))
num_male_par_updated<-length(unique(setdiff(df$male_par, df$correct_male)))
num_female_par_updated<-length(unique(setdiff(df$female_par, df$correct_female)))


#print("intersect, correct_female, clone_id")
#print(length(unique(intersect(df$correct_female, df$clone_id))))
##print(unique(intersect(df$correct_female, df$clone_id)))

#print("intersect, correct_male, clone_id")
#print(length(unique(intersect(df$correct_male, df$clone_id))))
#print(unique(intersect(df$correct_male, df$clone_id)))



formatting_df <- data.frame(
  Metric = c(
    "Offspring IDs",
    "Female Parents",
    "Male Parents"
  ),
  Count = c(
    num_id_updated,
    num_male_par_updated,
    num_female_par_updated
  )
)

file <- file.path(temp_dir, "formatting_summary.txt")
write.table(formatting_df, file, sep = "\t", row.names = FALSE, quote = FALSE)


number_records<-print(nrow(df))


numbers_df <- data.frame(
     Metric = c(
       "Number of Records"
      ),
      Count = c(
           number_records
  )
)

file <- file.path(temp_dir, "basic_figures.txt")
write.table(numbers_df, file, sep = "\t", row.names = FALSE, quote = FALSE)


entry_counts <- as.data.frame(table(df$year))
colnames(entry_counts) <- c("year", "entry_count")
entry_counts$year <- as.numeric(as.character(entry_counts$year))


file <- file.path(temp_dir, "year_count.txt")
write.table(entry_counts, file, sep = "\t", row.names = FALSE, quote = FALSE)



hist_file <- file.path(temp_dir, "year_histogram.png")

# Create and save histogram plot
png(filename = hist_file, width = 800, height = 600)
# Create enhanced histogram plot
ggplot(entry_counts, aes(x = factor(year), y = entry_count)) +   # use factor for discrete bars
  geom_col(fill = "#4C72B0", color = "#2A437C", width = 0.7, alpha = 0.85) +  # navy blue bars with border and transparency
  geom_text(aes(label = entry_count), vjust = -0.5, size = 4, color = "#2A437C", fontface = "bold") +  # values on top of bars
  labs(
    title = "Number of Offspring per Year",
    subtitle = "The number of individuals bred per year",
    x = "Year",
    y = "Entry Count"
  ) +
  theme_minimal(base_family = "Helvetica", base_size = 14) +
  theme(
    plot.title = element_text(size = 20, face = "bold", hjust = 0.5, margin = margin(b = 10)),
    plot.subtitle = element_text(size = 14, hjust = 0.5, margin = margin(b = 20)),
    axis.title = element_text(face = "bold"),
    axis.text.x = element_text(angle = 45, hjust = 1, color = "#2A437C", face = "bold"),
    axis.text.y = element_text(color = "#2A437C"),
    panel.grid.major = element_line(color = "#D9D9D9"),
    panel.grid.minor = element_blank(),
    panel.background = element_rect(fill = "#F9F9F9"),
    plot.background = element_rect(fill = "#FFFFFF", color = NA)
  ) +
  coord_cartesian(clip = 'off')  # allow text labels to not be cut off

dev.off()