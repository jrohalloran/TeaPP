
library(ggplot2)
library(scales)
library(openxlsx)
library(dplyr)
library(tibble)
library(tidyr)
library(ggplot2)
library(lubridate)


args <- commandArgs(trailingOnly = TRUE)

if (length(args) < 2) {
  stop("Not enough arguments. Expecting data file path and script directory.")
}
    # Path to the JSON file
script_dir <- args[2]  
input_file <- args[1]


cat("Script directory:", script_dir, "\n")

controller_dir <- dirname(script_dir)
print(controller_dir);

backend_dir <- dirname(controller_dir)
print(backend_dir);

print(input_file)


# Define the adjacent folder name (e.g., "data")
upload_subfolder <- "env_uploads"

temp_subfolder <- "temp_envir"

# Construct the full path
uploads_dir <- file.path(backend_dir,upload_subfolder)
temp_dir <- file.path(controller_dir, temp_subfolder)


message("Uploads Directory: ", uploads_dir)
message("Temp Directory: ", temp_dir)
message("Working directory set to: ", getwd())
message("Input file directory:", input_file)

setwd(temp_dir)
cat("Working directory set to:", getwd(), "\n")


df <- read.delim(input_file, header = TRUE, sep = "\t", stringsAsFactors = FALSE)

# View the data
#head(data)
# View the data as a proper data frame (datagram)
print(head(df))


df <- df %>% mutate_all(~ as.numeric(as.character(.)))
sapply(df, function(x) sum(is.na(as.numeric(as.character(x)))))


# Converting to long format 

df_long <- df %>%
  pivot_longer(
    cols = -year,
    names_to = "month",
    values_to = "rainfall"
  )


# Creating a Date Object (additional column)--> Assigning labels etc. 
df_long <- df_long %>%
  mutate(
    year = as.integer(year),
    date = dmy(paste("01", month, year))
  )



file<- paste0(temp_dir,"/rainfall_reformat.txt")

write.table(df_long,file,col.names = TRUE, row.names = FALSE,
            sep="\t", quote= F)

message("File Saved:", file)