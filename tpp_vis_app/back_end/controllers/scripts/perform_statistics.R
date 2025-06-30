

cat("✅ R script started...\n")

library(jsonlite)




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
head(df)


## ************ Exploration ********


# ----------------  Analysing Twins -----------------

## Removal of twins - how many are left?

## ------ NUMBER OF TWINS - TWIN NO.2
matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$correct_ID)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)


#### -------- TWIN NO.2 AS PARENTS
## Checking Twins ending in letter + "2" aren't used as parents 
matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$correct_ID)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$ID)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)
print(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$correct_male)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)


matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$correct_female)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)

## ------ NUMBER OF TWINS - TWIN NO.1
matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$correct_ID)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df) 


matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$ID)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df) 
print(matching_df)

#### -------- NO PARENTS ARE TWINS 
## Checking Twins ending in letter + "1" aren't used as parents 
matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$correct_female)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$correct_male)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)



# Initialize an empty data frame to store results
results <- data.frame(
  Description = character(),
  Count = integer(),
  stringsAsFactors = FALSE
)

# Twin No.1
matched_rows <- grepl("^\\d{6,7}([a-zA-Z/])1$", df$correct_ID)
results <- rbind(results, data.frame(Description = "Twin No.1 IDs", Count = sum(matched_rows)))

matched_rows <- grepl("^\\d{6,7}([a-zA-Z/])1$", df$correct_male)
results <- rbind(results, data.frame(Description = "Twin No.1 used as father", Count = sum(matched_rows)))

matched_rows <- grepl("^\\d{6,7}([a-zA-Z/])1$", df$correct_female)
results <- rbind(results, data.frame(Description = "Twin No.1 used as mother", Count = sum(matched_rows)))

# Twin No.2
matched_rows <- grepl("^\\d{6,7}([a-zA-Z/])2$", df$correct_ID)
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
length(matched_parents)
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)

# Checking if any of them are siblings themselves (same prefix)

# Extract the first 7 characters
prefixes <- substr(matched_parents, 1, 7)
length(prefixes)
length(unique(prefixes))


# Find duplicated prefixes
dup_prefixes <- unique(prefixes[duplicated(prefixes)])
length(unique(dup_prefixes))

# Now find which elements correspond to each duplicated prefix
result <- lapply(dup_prefixes, function(p) matched_parents[prefixes == p])

all_matched <- unlist(result)

count_table <- table(unlist(result))

# Sort in decreasing order (highest count first)
ranked_counts <- sort(count_table, decreasing = TRUE)

print(ranked_counts)

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
print(results)


file<- paste0(temp_dir,"/sibling_counts.txt")
write.table(results, file = file, sep = "\t", row.names = FALSE, quote = FALSE)




length(unique(c(df$correct_female)))
length(unique(c(df$correct_male))) 
length(intersect(unique(c(df$correct_female)),unique(c(df$correct_male))))
length(setdiff(unique(c(df$correct_female)),unique(c(df$correct_male))))
length(setdiff(unique(c(df$correct_male)),unique(c(df$correct_female))))


parents <- unique(c(df$correct_male,df$correct_female))
length(parents)

# Calculate values
num_female_unique <- length(unique(c(df$correct_female)))
num_male_unique <- length(unique(c(df$correct_male)))
num_intersect <- length(intersect(unique(c(df$correct_female)), unique(c(df$correct_male))))
num_female_not_male <- length(setdiff(unique(c(df$correct_female)), unique(c(df$correct_male))))
num_male_not_female <- length(setdiff(unique(c(df$correct_male)), unique(c(df$correct_female))))


parents <- unique(c(df$correct_male,df$correct_female))
num_parents <- length(parents)

# Prepare output lines
output_lines <- c(
    paste("Unique parents:", num_parents),
    paste("Unique Female Parents:", num_female_unique),
    paste("Unique Male Parents:", num_male_unique),
    paste("Used as Both:", num_intersect),
    paste("Female only:", num_female_not_male),
    paste("Male only:", num_male_not_female)
)

# Write to file
file<- paste0(temp_dir,"/summary_counts.txt")
writeLines(output_lines, "summary_counts.txt")




