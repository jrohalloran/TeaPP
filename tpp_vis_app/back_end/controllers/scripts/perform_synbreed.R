


cat("✅ R script started...\n")

library(synbreed)
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

# Remove entries that are flagged 

ped <- create.pedigree(
  ID=df$correct_ID,
  Par1=df$correct_female,
  Par2=df$correct_male,
  add.ancestors=T)

file<- paste0(temp_dir,"/synbreed_pedigree.txt")
message("Saving file: ", file)

output_path <- file.path(temp_dir, "synbreed_pedigree.txt")
write.table(ped,
            file = output_path,
            sep = "\t",
            row.names = FALSE,
            col.names = TRUE,
            quote = FALSE)

gp <- create.gpData(pedigree=ped)
