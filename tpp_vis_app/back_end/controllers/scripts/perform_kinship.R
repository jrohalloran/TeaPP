

## Jennifer O'Halloran

## 02/07/25

## Thesis Project: TeaPP Visualisation App Prototype 

cat("✅ R script started...\n")

library(synbreed)
library(jsonlite)
library(VennDiagram)
library(grid)
library(AGHmatrix)

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
#df <- fromJSON(json_file)
df <- read.delim(json_file, header = TRUE, sep = "\t", stringsAsFactors = FALSE)

# View the data
#head(data)
# View the data as a proper data frame (datagram)
head(df)


cols_to_clean <- c("clone_id", "correct_female", "correct_male", "correct_id")

# Convert to character and remove whitespace
df[cols_to_clean] <- lapply(df[cols_to_clean], function(x) {
  x <- as.character(x)
  x <- gsub("\\s+", "", x) 
  x
})

head(df)


ped <- create.pedigree(
  ID=df$correct_id,
  Par1=df$correct_female,
  Par2=df$correct_male,
  add.ancestors=T)


message("Table of Generations")

print(table(ped$gener))

file<- paste0(temp_dir,"/pedigree.txt")
write.table(ped, file, 
            sep="\t", row.names = F, quote= F)


gp <- create.gpData(pedigree=ped)

summary(gp)

message("Performing Kinship Matrix")
#kinship.mx <- kin(gp)


#file<- paste0(temp_dir,"/kinship_matrix.txt")
#write.csv(kinship.mx, file, row.names = TRUE)

#write.table(kinship.mx, file, sep = "\t", quote = FALSE, row.names = TRUE, col.names = NA)

#library(AGHmatrix)

pedigree <- gp$pedigree

pedigree <- data.frame(
  ID = pedigree$ID,
  Par1 = pedigree$Par1,
  Par2 = pedigree$Par2
)


# Compute additive kinship matrix
A_matrix <- Amatrix(pedigree, ploidy = 2, dominance = FALSE)
## Tea Trees are Diploid
## A Matrix - pedigree-based 


# Save it


#write.csv(A_matrix, "A_matrix.csv")

##write.table(A_matrix, "A_matrix.txt")

file<- paste0(temp_dir,"/kinship_matrix.txt")
write.table(A_matrix, file, sep = "\t", quote = FALSE, row.names = TRUE, col.names = NA)
