
## Jennifer O'Halloran

## 04/07/25

## Thesis Project: TeaPP Visualisation App Prototype 

library(openxlsx)
library(dplyr)
library(tibble)
library(tidyr)
library(ggplot2)
library(lubridate)
library(readxl)
library(janitor)
library(stringr)
library(zoo) 
library(ggrepel)


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


upload_subfolder <- "env_temp_uploads"

temp_subfolder <- "temp_envir_temp"

# Construct the full path
uploads_dir <- file.path(backend_dir,upload_subfolder)
temp_dir <- file.path(controller_dir, temp_subfolder)


message("Uploads Directory: ", uploads_dir)
message("Temp Directory: ", temp_dir)
message("Working directory set to: ", getwd())
message("Input file directory:", input_file)

setwd(temp_dir)
cat("Working directory set to:", getwd(), "\n")


df <- read.delim(input_file, header = TRUE, sep = "\t", stringsAsFactors = TRUE)

df <- df %>%
  mutate(YEAR = na.locf(YEAR)) 

names(df) <- toupper(names(df))

cols_to_exclude <- c("MEAN")
df<- df %>% select(-all_of(cols_to_exclude))



names(df) <- make.names(names(df), unique = TRUE)
names(df)[2] <- "STAT" 
colnames(df)
names(df) <- trimws(names(df))                   
names(df) <- toupper(names(df))                 
names(df) <- gsub("[^A-Z]", "", names(df))         
names(df) <- make.names(names(df), unique = TRUE)
names(df) <- toupper(trimws(names(df)))



month_cols <- grep("JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC", names(df), value = TRUE)
print(month_cols) 



df_long <- df %>%
  mutate(YEAR = zoo::na.locf(YEAR)) %>%
  pivot_longer(cols = all_of(month_cols),
               names_to = "MONTH",
               values_to = "VALUE") %>%
  mutate(
    MONTH = factor(MONTH, levels = toupper(month.abb)),
    VALUE = as.numeric(VALUE)
  )

df_long$YEAR <- as.factor(df_long$YEAR)
df_long$MONTH<- as.factor(df_long$MONTH)




file<- paste0(temp_dir,"/temp_reformat.txt")

write.table(df_long,file,col.names = TRUE, row.names = FALSE,
  sep="\t", quote= F)

