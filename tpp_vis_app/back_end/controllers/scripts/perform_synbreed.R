


cat("✅ R script started...\n")

library(synbreed)
library(jsonlite)
library(VennDiagram)
library(grid)

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


gener_table <- table(ped$gener)

# Save it as a text file
file<- paste0(temp_dir,"/gener_table.txt")
write.table(gener_table, file = file, sep = "\t", col.names = NA, quote = FALSE)

## Exploring pedigree


gen0<- ped[ped$gener == 0, ]
gen0_ID<-gen0$ID


## Generation 1
gen1<- ped[ped$gener == 1, ]

# View them
#print(gen1)

length(unique(gen1$ID))

# Extract only digits from each ID for comparison
digit_only_ids_gen1<- gsub("[^0-9]", "", gen1$ID)

# Now extract the first two and first one digits from the digit-only versions
first_two_digits <- substr(digit_only_ids_gen1, 1, 2)
first_one_digits <- substr(digit_only_ids_gen1, 1, 1)


# If you want unique first two digits only
unique_first_two_1 <- unique(first_two_digits)
unique_first_one_1 <- unique(first_one_digits)
print(unique_first_two_1)
print(unique_first_one_1)

unique_parents1<-unique(gen1$Par1,gen1$Par2)
length(intersect(gen1$Par1,gen1$Par2))
length(unique_parents1)
length(unique_first_two_1)

## Generation 2
gen2<- ped[ped$gener == 2, ]
#print(gen2)

# Getting Number in generation
length(unique(gen2$ID))

# Extract only digits from each ID for comparison
digit_only_ids_gen2 <- gsub("[^0-9]", "", gen2$ID)

# Now extract the first two and first one digits from the digit-only versions
first_two_digits <- substr(digit_only_ids_gen2, 1, 2)
first_one_digits <- substr(digit_only_ids_gen2, 1, 1)

unique_first_two_2 <- unique(first_two_digits)
unique_first_one_2 <- unique(first_one_digits)
print(unique_first_two_2)
print(unique_first_one_2)

# Getting unique parents
unique_parents2<-unique(gen2$Par1,gen2$Par2)
length(intersect(gen2$Par1,gen2$Par2))
length(unique_parents2)
length(unique_first_two_2)


## Generation 3
gen3<- ped[ped$gener == 3, ]
#print(gen3)

# Getting Number in generation
length(unique(gen3$ID))

# Extract only digits from each ID for comparison
digit_only_ids_gen3 <- gsub("[^0-9]", "", gen3$ID)

# Now extract the first two and first one digits from the digit-only versions
first_two_digits <- substr(digit_only_ids_gen3, 1, 2)
first_one_digits <- substr(digit_only_ids_gen3, 1, 1)

# Get unique sets for comparison
unique_first_two_3 <- unique(first_two_digits)
unique_first_one_3 <- unique(first_one_digits)
print(unique_first_two_3)


# Your sets
set1 <- unique_first_two_1
set2 <- unique_first_two_2
set3 <- unique_first_two_3

file<- paste0(temp_dir,"/year_gen_venn.png")
# Open the PNG device
png(file, width = 800, height = 800)

# Create the Venn diagram grob
venn.plot <- draw.triple.venn(
  area1 = length(set1),
  area2 = length(set2),
  area3 = length(set3),
  n12 = length(intersect(set1, set2)),
  n23 = length(intersect(set2, set3)),
  n13 = length(intersect(set1, set3)),
  n123 = length(Reduce(intersect, list(set1, set2, set3))),
  category = c("Gen 1", "Gen 2", "Gen 3"),
  fill = c("grey", "darkcyan", "orange"),
  cex = 1.5,
  cat.cex = 1.5,
  cat.pos = 0
)

# Explicitly draw the grob to the device
grid.draw(venn.plot)

# Close the device to save the file
dev.off()


# Load necessary libraries
library(VennDiagram)
library(grid)

# Output path
file <- paste0(temp_dir, "/year_gen_venn_2.png")

# Get all unique generations
##all_gens <- sort(unique(ped$gener))
all_gens <- sort(unique(ped$gener[ped$gener != 0]))
# Initialize list to store digit-prefix sets per generation
prefix_sets <- list()

# Extract digit-only prefixes for each generation
for (gen in all_gens) {
  gen_data <- ped[ped$gener == gen, ]
  digit_only_ids <- gsub("[^0-9]", "", gen_data$ID)
  prefix_set <- unique(substr(digit_only_ids, 1, 2))
  prefix_sets[[paste0("Gen", gen)]] <- prefix_set
}

# Determine number of sets
num_sets <- length(prefix_sets)

# Open PNG device
png(file, width = 900, height = 900)

# Switch: 1 to 5 generations
if (num_sets == 1) {
  plot.new()
  text(0.5, 0.5, "Only one generation found. Venn diagram not applicable.", cex = 1.5)
  
} else if (num_sets == 2) {
  venn.plot <- draw.pairwise.venn(
    area1 = length(prefix_sets[[1]]),
    area2 = length(prefix_sets[[2]]),
    cross.area = length(intersect(prefix_sets[[1]], prefix_sets[[2]])),
    category = names(prefix_sets)[1:2],
    fill = c("grey", "darkcyan"),
    cex = 1.5,
    cat.cex = 1.5
  )
  grid.draw(venn.plot)
  
} else if (num_sets == 3) {
  venn.plot <- draw.triple.venn(
    area1 = length(prefix_sets[[1]]),
    area2 = length(prefix_sets[[2]]),
    area3 = length(prefix_sets[[3]]),
    n12 = length(intersect(prefix_sets[[1]], prefix_sets[[2]])),
    n23 = length(intersect(prefix_sets[[2]], prefix_sets[[3]])),
    n13 = length(intersect(prefix_sets[[1]], prefix_sets[[3]])),
    n123 = length(Reduce(intersect, prefix_sets[1:3])),
    category = names(prefix_sets)[1:3],
    fill = c("grey", "darkcyan", "orange"),
    cex = 1.5,
    cat.cex = 1.5
  )
  grid.draw(venn.plot)
  
} else if (num_sets == 4) {
  s <- prefix_sets
  venn.plot <- draw.quad.venn(
    area1 = length(s[[1]]),
    area2 = length(s[[2]]),
    area3 = length(s[[3]]),
    area4 = length(s[[4]]),
    n12 = length(intersect(s[[1]], s[[2]])),
    n13 = length(intersect(s[[1]], s[[3]])),
    n14 = length(intersect(s[[1]], s[[4]])),
    n23 = length(intersect(s[[2]], s[[3]])),
    n24 = length(intersect(s[[2]], s[[4]])),
    n34 = length(intersect(s[[3]], s[[4]])),
    n123 = length(Reduce(intersect, s[1:3])),
    n124 = length(Reduce(intersect, s[c(1,2,4)])),
    n134 = length(Reduce(intersect, s[c(1,3,4)])),
    n234 = length(Reduce(intersect, s[2:4])),
    n1234 = length(Reduce(intersect, s[1:4])),
    category = names(s),
    fill = c("grey", "darkcyan", "orange", "purple"),
    cex = 1.5,
    cat.cex = 1.5
  )
  grid.draw(venn.plot)
  
} else if (num_sets == 5) {
  s <- prefix_sets
  names(s) <- paste0("s", 1:5)
  s1 <- s[[1]]; s2 <- s[[2]]; s3 <- s[[3]]; s4 <- s[[4]]; s5 <- s[[5]]

  venn.plot <- draw.quintuple.venn(
    area1 = length(s1), area2 = length(s2), area3 = length(s3),
    area4 = length(s4), area5 = length(s5),
    n12 = length(intersect(s1, s2)),
    n13 = length(intersect(s1, s3)),
    n14 = length(intersect(s1, s4)),
    n15 = length(intersect(s1, s5)),
    n23 = length(intersect(s2, s3)),
    n24 = length(intersect(s2, s4)),
    n25 = length(intersect(s2, s5)),
    n34 = length(intersect(s3, s4)),
    n35 = length(intersect(s3, s5)),
    n45 = length(intersect(s4, s5)),
    n123 = length(Reduce(intersect, list(s1, s2, s3))),
    n124 = length(Reduce(intersect, list(s1, s2, s4))),
    n125 = length(Reduce(intersect, list(s1, s2, s5))),
    n134 = length(Reduce(intersect, list(s1, s3, s4))),
    n135 = length(Reduce(intersect, list(s1, s3, s5))),
    n145 = length(Reduce(intersect, list(s1, s4, s5))),
    n234 = length(Reduce(intersect, list(s2, s3, s4))),
    n235 = length(Reduce(intersect, list(s2, s3, s5))),
    n245 = length(Reduce(intersect, list(s2, s4, s5))),
    n345 = length(Reduce(intersect, list(s3, s4, s5))),
    n1234 = length(Reduce(intersect, list(s1, s2, s3, s4))),
    n1235 = length(Reduce(intersect, list(s1, s2, s3, s5))),
    n1245 = length(Reduce(intersect, list(s1, s2, s4, s5))),
    n1345 = length(Reduce(intersect, list(s1, s3, s4, s5))),
    n2345 = length(Reduce(intersect, list(s2, s3, s4, s5))),
    n12345 = length(Reduce(intersect, list(s1, s2, s3, s4, s5))),
    category = names(prefix_sets),
    fill = c("grey", "darkcyan", "orange", "purple", "green"),
    cex = 1.3,
    cat.cex = 1.3
  )
  grid.draw(venn.plot)
  
} else {
  # Fallback: more than 5 generations
  plot.new()
  text(0.5, 0.5, "More than 5 generations. Use UpSet plots instead of Venn diagrams.", cex = 1.5)
}

# Close PNG
dev.off()


# Getting unique parents
unique_parents3<-unique(gen3$Par1,gen3$Par2)

# Parents used as both Female and Male 
length(intersect(gen3$Par1,gen3$Par2))

length(unique_parents3)


# Parents used across all generations 
intersect(unique_parents2, intersect(unique_parents3, unique_parents1))

#Between Gen1 and Gen 2 
intersect(unique_parents1, unique_parents2)
length(intersect(unique_parents1, unique_parents2))


#Between Gen1 and Gen 3 
intersect(unique_parents1, unique_parents3)
length(intersect(unique_parents1, unique_parents3))

#Between Gen2 and Gen 3 
intersect(unique_parents2, unique_parents3)
length(intersect(unique_parents2, unique_parents3))


# Your sets
set1 <- unique_parents1
set2 <- unique_parents2
set3 <- unique_parents3


file<- paste0(temp_dir,"/venn_parents_Gener.png")
# Open the PNG device
png(file, width = 800, height = 800)
# Open the PNG device

# Create the Venn diagram grob
venn.plot <- draw.triple.venn(
  area1 = length(set1),
  area2 = length(set2),
  area3 = length(set3),
  n12 = length(intersect(set1, set2)),
  n23 = length(intersect(set2, set3)),
  n13 = length(intersect(set1, set3)),
  n123 = length(Reduce(intersect, list(set1, set2, set3))),
  category = c("Gen 1", "Gen 2", "Gen 3"),
  fill = c("skyblue", "lightgreen", "yellow"),
  cex = 1.5,
  cat.cex = 1.5,
  cat.pos = 0
)

# Explicitly draw the grob to the device
grid.draw(venn.plot)

# Close the device to save the file
dev.off()



# Output file
file <- paste0(temp_dir, "/venn_parents_Gener_2.png")
png(file, width = 900, height = 900)

# Get all unique generations
#all_gens <- sort(unique(ped$gener))
all_gens <- sort(unique(ped$gener[ped$gener != 0]))

# Step 1: Create list of unique parents per generation
parent_sets <- list()
for (gen in all_gens) {
  gen_data <- ped[ped$gener == gen, ]
  # Combine Par1 and Par2
  parent_ids <- unique(c(gen_data$Par1, gen_data$Par2))
  # Remove NAs
  parent_ids <- parent_ids[!is.na(parent_ids)]
  parent_sets[[paste0("Gen", gen)]] <- parent_ids
}

# Determine number of generations (sets)
num_sets <- length(parent_sets)

# Plot based on set count
if (num_sets == 1) {
  plot.new()
  text(0.5, 0.5, "Only one generation found. Venn diagram not applicable.", cex = 1.5)
  
} else if (num_sets == 2) {
  venn.plot <- draw.pairwise.venn(
    area1 = length(parent_sets[[1]]),
    area2 = length(parent_sets[[2]]),
    cross.area = length(intersect(parent_sets[[1]], parent_sets[[2]])),
    category = names(parent_sets)[1:2],
    fill = c("skyblue", "lightgreen"),
    cex = 1.5,
    cat.cex = 1.5
  )
  grid.draw(venn.plot)
  
} else if (num_sets == 3) {
  venn.plot <- draw.triple.venn(
    area1 = length(parent_sets[[1]]),
    area2 = length(parent_sets[[2]]),
    area3 = length(parent_sets[[3]]),
    n12 = length(intersect(parent_sets[[1]], parent_sets[[2]])),
    n23 = length(intersect(parent_sets[[2]], parent_sets[[3]])),
    n13 = length(intersect(parent_sets[[1]], parent_sets[[3]])),
    n123 = length(Reduce(intersect, parent_sets[1:3])),
    category = names(parent_sets)[1:3],
    fill = c("skyblue", "lightgreen", "yellow"),
    cex = 1.5,
    cat.cex = 1.5
  )
  grid.draw(venn.plot)
  
} else if (num_sets == 4) {
  s <- parent_sets
  venn.plot <- draw.quad.venn(
    area1 = length(s[[1]]),
    area2 = length(s[[2]]),
    area3 = length(s[[3]]),
    area4 = length(s[[4]]),
    n12 = length(intersect(s[[1]], s[[2]])),
    n13 = length(intersect(s[[1]], s[[3]])),
    n14 = length(intersect(s[[1]], s[[4]])),
    n23 = length(intersect(s[[2]], s[[3]])),
    n24 = length(intersect(s[[2]], s[[4]])),
    n34 = length(intersect(s[[3]], s[[4]])),
    n123 = length(Reduce(intersect, s[1:3])),
    n124 = length(Reduce(intersect, s[c(1,2,4)])),
    n134 = length(Reduce(intersect, s[c(1,3,4)])),
    n234 = length(Reduce(intersect, s[2:4])),
    n1234 = length(Reduce(intersect, s[1:4])),
    category = names(s),
    fill = c("skyblue", "lightgreen", "yellow", "orchid"),
    cex = 1.5,
    cat.cex = 1.5
  )
  grid.draw(venn.plot)
  
} else if (num_sets == 5) {
  s <- parent_sets
  s1 <- s[[1]]; s2 <- s[[2]]; s3 <- s[[3]]; s4 <- s[[4]]; s5 <- s[[5]]

  venn.plot <- draw.quintuple.venn(
    area1 = length(s1), area2 = length(s2), area3 = length(s3),
    area4 = length(s4), area5 = length(s5),
    n12 = length(intersect(s1, s2)),
    n13 = length(intersect(s1, s3)),
    n14 = length(intersect(s1, s4)),
    n15 = length(intersect(s1, s5)),
    n23 = length(intersect(s2, s3)),
    n24 = length(intersect(s2, s4)),
    n25 = length(intersect(s2, s5)),
    n34 = length(intersect(s3, s4)),
    n35 = length(intersect(s3, s5)),
    n45 = length(intersect(s4, s5)),
    n123 = length(Reduce(intersect, list(s1, s2, s3))),
    n124 = length(Reduce(intersect, list(s1, s2, s4))),
    n125 = length(Reduce(intersect, list(s1, s2, s5))),
    n134 = length(Reduce(intersect, list(s1, s3, s4))),
    n135 = length(Reduce(intersect, list(s1, s3, s5))),
    n145 = length(Reduce(intersect, list(s1, s4, s5))),
    n234 = length(Reduce(intersect, list(s2, s3, s4))),
    n235 = length(Reduce(intersect, list(s2, s3, s5))),
    n245 = length(Reduce(intersect, list(s2, s4, s5))),
    n345 = length(Reduce(intersect, list(s3, s4, s5))),
    n1234 = length(Reduce(intersect, list(s1, s2, s3, s4))),
    n1235 = length(Reduce(intersect, list(s1, s2, s3, s5))),
    n1245 = length(Reduce(intersect, list(s1, s2, s4, s5))),
    n1345 = length(Reduce(intersect, list(s1, s3, s4, s5))),
    n2345 = length(Reduce(intersect, list(s2, s3, s4, s5))),
    n12345 = length(Reduce(intersect, list(s1, s2, s3, s4, s5))),
    category = names(parent_sets),
    fill = c("skyblue", "lightgreen", "yellow", "orchid", "tomato"),
    cex = 1.3,
    cat.cex = 1.3
  )
  grid.draw(venn.plot)

} else {
  # Fallback message for more than 5 sets
  plot.new()
  text(0.5, 0.5, "More than 5 generations. Consider using UpSet plots.", cex = 1.5)
}

# Close PNG device
dev.off()
