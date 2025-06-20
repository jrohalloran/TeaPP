

## Jennifer O'Halloran

## 18/06/25

## Thesis Project: TeaPP Visualisation App Prototype 

cat("✅ R script started...\n")

library(openxlsx)
library(dplyr)

message("Starting Processing of Raw Uploaded Data.....")

args <- commandArgs(trailingOnly = FALSE)
script_path <- sub("--file=", "", args[grep("--file=", args)])
script_dir <- dirname(normalizePath(script_path))



# Move one level up to the parent directory
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

# Set the working directory
if (!dir.exists(temp_dir)) {
  dir.create(temp_dir, recursive = TRUE)
}
setwd(temp_dir)

# Optional: print to verify
cat("Working directory set to:", getwd(), "\n")

cat("Getting files from:", uploads_dir, "\n")
files <- list.files(uploads_dir, full.names = TRUE)


# Initialize list to store valid data frames
df_list <- list()
col_template <- NULL  # To enforce consistent columns

for (i in seq_along(files)) {
  file <- files[i]
  message("Reading file: ", file)
  
  # Try to read the file with header and fill short rows
  df <- tryCatch({
    read.table(file, header = TRUE, sep = "\t", stringsAsFactors = FALSE, fill = TRUE, comment.char = "")
  }, error = function(e) {
    warning(sprintf("Skipping file %s due to read error: %s", file, e$message))
    return(NULL)
  })
  
  # Skip NULL or empty data
  if (is.null(df) || nrow(df) == 0) next
  
  # Set column template from first good file
  if (is.null(col_template)) {
    col_template <- colnames(df)
  }
  
  # Check if columns match
  if (!identical(colnames(df), col_template)) {
    warning(sprintf("Skipping file %s due to column mismatch.", file))
    next
  }
  
  df_list[[length(df_list) + 1]] <- df
}


# Combine all valid data frames
all_data <- do.call(rbind, df_list)


# View result
print(dim(all_data))
head(all_data)

message("First file columns: ", paste(col_template, collapse = ", "))
message("Combined data columns: ", paste(colnames(all_data), collapse = ", "))

df<-data.frame(all_data)

######## PROCESSING ############

print(colnames(df))
## Removing IDs that are na
df <- df%>%filter(!is.na(ID))



message("Converting to Characters....")
## Converting to characters / string 
df$ID <- as.character(df$ID)
df$Female_parent <- as.character(df$Female_parent)
df$Male_parent <- as.character(df$Male_parent)

df$ID <- toupper(df$ID)
df$Female_parent <- toupper(df$Female_parent)
df$Male_parent <- toupper(df$Male_parent)

df$ID<- gsub("\\s+", "", df$ID)
df$Female_parent<- gsub("\\s+", "", df$Female_parent)
df$Male_parent<- gsub("\\s+", "", df$Male_parent)

nrow(df)

## Create new column correct ID, correct parents 

correct_df<- data.frame(
  ID = df$ID,
  Female_parent = df$Female_parent,
  Male_parent = df$Male_parent,
  correct_ID = df$ID,
  correct_Female = df$Female_parent,
  correct_Male = df$Male_parent
)

##### Identifying Parents with internal spaces ######

# Define which columns to check
cols_to_check <- c("correct_Female", "correct_Male")  # replace with your actual column names


message("Removing Whitespace....")
# Find rows with whitespace in any of the selected columns
has_whitespace <- apply(correct_df[cols_to_check], 1, function(row) {
  any(grepl("\\S\\s+\\S", row))
})

# View rows with whitespace
rows_with_whitespace <- correct_df[has_whitespace, ]

correct_df[cols_to_check] <- lapply(correct_df[cols_to_check], function(col) {
  gsub("\\s+", "", col)
})


## Checking they have been removed 
has_whitespace <- apply(correct_df[cols_to_check], 1, function(row) {
  any(grepl("\\S\\s+\\S", row))
})
rows_with_whitespace <- correct_df[has_whitespace, ]

cols_to_check <- c("Female_parent", "Male_parent")
has_whitespace <- apply(correct_df[cols_to_check], 1, function(row) {
  any(grepl("\\S\\s+\\S", row))
})
rows_with_whitespace <- correct_df[has_whitespace, ]





########### Processing clone IDs ##########





message("Processing Clone IDs....")

valid_clones_7 <- df[grepl("^\\d{7}([a-zA-Z]\\d?)?$", df$ID), ]
nrow(valid_clones_7)

valid_clones_6 <- df[grepl("^\\d{6}([a-zA-Z]\\d?)?$", df$ID), ]
nrow(valid_clones_6)


invalid_clones <- df[!grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", df$ID), ]
nrow(invalid_clones)


invalid_clones <- df[grepl("^\\d{6}([a-zA-Z]\\d?)?$", df$ID), ]
nrow(invalid_clones)

message("Checking against Clone ID format....")

## Getting ID that have a missing 0 (0+ 5 digits)
digit_clones <- df[grepl("^0\\d{5}([a-zA-Z])?$", df$ID), ]
nrow(digit_clones)

### Updating these in correct_df  -- Add 0 
pattern <- "^0\\d{5}([a-zA-Z])?$"
matching_rows <- grepl(pattern, correct_df$correct_ID)
correct_df$correct_ID[matching_rows] <- paste0("0", correct_df$correct_ID[matching_rows])


digit_clones <- correct_df[grepl("^0\\d{5}([a-zA-Z])?$",correct_df$ID), ]
nrow(digit_clones)
digit_clones <- correct_df[grepl("^0\\d{5}([a-zA-Z])?$",correct_df$correct_ID), ]
nrow(digit_clones)




## Getting row with additional / 

clone_with_slash <- df[grepl("^\\d{7}[a-zA-Z]/\\d+$", df$ID), ]
nrow(clone_with_slash)



### Updating these in correct_df  -- remove / 

# Step 1: Define the pattern
pattern <- "^\\d{7}[a-zA-Z]/\\d+$"
matching_rows <- grepl(pattern, correct_df$correct_ID)
correct_df$correct_ID[matching_rows] <- gsub("/", "", correct_df$correct_ID[matching_rows])

## replace with "a"??
clone_with_slash <- correct_df[grepl("^\\d{7}[a-zA-Z]/\\d+$",correct_df$ID), ]
nrow(clone_with_slash)
clone_with_slash <- correct_df[grepl("^\\d{7}[a-zA-Z]/\\d+$",correct_df$correct_ID), ]
nrow(clone_with_slash)



### getting those with "/" instead of sibling letter

clone_without_sibling <- correct_df[grepl("^\\d{6,7}/\\d$",correct_df$ID), ]
clone_without_sibling_correct <- correct_df[grepl("^\\d{6,7}/\\d$",correct_df$correct_ID), ]
nrow(clone_without_sibling)
nrow(clone_without_sibling_correct)


# Step 1: Define the pattern
pattern <- "^\\d{6,7}/\\d$"
matching_rows <- grepl(pattern, correct_df$correct_ID)
correct_df$correct_ID[matching_rows] <- gsub("/", "A", correct_df$correct_ID[matching_rows])

## replace with "a"??
clone_without_sibling <- correct_df[grepl("^\\d{6,7}/\\d$",correct_df$ID), ]
clone_without_sibling_correct <- correct_df[grepl("^\\d{6,7}/\\d$",correct_df$correct_ID), ]
nrow(clone_without_sibling)
nrow(clone_without_sibling_correct)



## Checking clone processing progress 

valid_clones_7 <- correct_df[grepl("^\\d{7}([a-zA-Z]\\d?)?$", correct_df$correct_ID), ]
nrow(valid_clones_7)

valid_clones_6 <- correct_df[grepl("^\\d{6}([a-zA-Z]\\d?)?$", correct_df$correct_ID), ]
nrow(valid_clones_6)


invalid_clones <- correct_df[!grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", correct_df$correct_ID), ]
nrow(invalid_clones)

### AFTER processing invalid clone IDs
invalid_IDs<-invalid_clones$ID
##print(invalid_IDs)





parents <- c(df$Female_parent,df$Male_parent)

#setdiff(unique(parents),df$ID)
#length(setdiff(unique(parents),df$ID))
#length(setdiff(df$ID,unique(parents)))


#setdiff(unique(parents),correct_df$correct_ID)
#length(setdiff(unique(parents),correct_df$correct_ID))

### AFTER processing Parents that dont match corrected IDs
setdiff(unique(parents),correct_df$correct_ID)
length(setdiff(unique(parents),correct_df$correct_ID))

non_match_parents <- setdiff(unique(parents),correct_df$correct_ID)


# Parents that dont match Processed Clone IDs
#setdiff(unique(parents),correct_df$correct_ID)

## Female parents that dont match code format
invalid_F <- correct_df[!grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", correct_df$Female_parent), ]
length(unique(invalid_F$Female_parent))

## Male parents that dont match code format
invalid_M <- correct_df[!grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", correct_df$Male_parent), ]
length(unique(invalid_M$Male_parent))



# Checking for duplicates 

message("Checking for duplicates....")
unique(correct_df$correct_ID[duplicated(correct_df$correct_ID)])

correct_df[duplicated(correct_df$correct_ID) | duplicated(correct_df$correct_ID, fromLast = TRUE), ]

## Removing Duplicates
correct_df <- correct_df[!duplicated(correct_df$correct_ID), ]


### Save File to local area ####


file<- paste0(temp_dir,"/preprocessed_data.txt")


message("Saving file: ", file)
write.table(correct_df,file= file,col.names = TRUE, row.names = FALSE,
            sep="\t", quote= F)

file<- paste0(temp_dir,"/non_match_parents.txt")
message("Saving file: ", file)

write(non_match_parents, file=file, sep="\n")

file<- paste0(temp_dir,"/invalid_IDs.txt")
message("Saving file: ", file)

write(invalid_IDs, file=file, sep="\n")


