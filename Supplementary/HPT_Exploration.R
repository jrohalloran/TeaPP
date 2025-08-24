### Jennifer O'Halloran

## HPT Exploration Script
## IBIX Thesis Project July/August 2025


install.packages("openxlsx")
install.packages("dplyr")

install.packages("doBy")
install.packages("regress")
install.packages("qtl")
install.packages("BiocManager")
install.packages("devtools")

BiocManager::install("snpStats")
devtools::install_github("SFUStatgen/LDheatmap")
install.packages("synbreed",repos="http://r-forge.r-project.org")
install.packages(c('BGLR', 'igraph', 'LDheatmap'))

library(synbreed)
library(openxlsx)
library(dplyr)


setwd("~/Documents/Cranfield/Thesis/Data_Resources")
data <- read.xlsx("HPT_Clones_Edited.xlsx", sheet = 1)

# Removing any "NA" clone entries 
df <- data%>%filter(!is.na(Clone_CODE))

# Replacing "-" with na 
cols_to_fix <- c("F_G_Female", "F_G_Male", "M_G_Female", "M_G_Male")

df[cols_to_fix] <- lapply(df[cols_to_fix], function(x) {
  replace(x, x == "-", NA)
})



# Number of raw entries 

nrow(df)  # N = 47864








# Getting Ancestors

##### DO THIS AFTER CLEANING DATA?

### -------------- Entries with no parental info -----------------
# Subsetting Ancestor generation clones (no parental info)
cols_to_check <- c("Female_parent","Male_parent")
subset_ancestors <- df %>%
  filter(if_all(all_of(cols_to_check), is.na))


### Number of clone entries with not parents. - Potential founders (84)
length(subset_ancestors$Clone_CODE)


### FORMATTING PARENTS 
## -------------------------------------------------------------------------
# Identify parents with spaces 
cols_to_check <- c("Male_parent","Female_parent")
rows_with_spaces <- df[apply(df[cols_to_check], 1, function(row) any(grepl(" ", row))), ]

# Stats before processing 
length(unique(c(df$Female_parent))) # Females before 
length(unique(c(df$Male_parent))) # Males before 
length(intersect(unique(c(df$Female_parent)),unique(c(df$Male_parent))))
length(setdiff(unique(c(df$Female_parent)),unique(c(df$Male_parent))))
length(setdiff(unique(c(df$Male_parent)),unique(c(df$Female_parent))))


library(VennDiagram)
library(grid)

## Drawing Venn Diagram - Unique Parents Before 
set1 <- unique(df$Male_parent)
set2 <- unique(df$Female_parent)
png("parents_before_venn.png", width = 800, height = 800)

venn.plot <- draw.pairwise.venn(
  length(set1),
  length(set2),
  length(intersect(set1, set2)),
  category = c("Males", "Female"),
  fill = c("skyblue", "lightpink"),
  cex = 1.5,
  cat.cex = 1.5,
  cat.pos = 0,
  scaled = FALSE
)

grid.draw(venn.plot)
dev.off()


## Manually changing parental names

sum(grepl("YAB JAT4", df$Male_parent))
sum(grepl("YAB JAT4", df$Female_parent))

df$Male_parent <- gsub("YAB JAT4", "YAB_JAT4", df$Male_parent)
df$Female_parent <- gsub("YAB JAT4", "YAB_JAT4", df$Female_parent)

sum(grepl("YAB_JAT4", df$Male_parent))
sum(grepl("YAB_JAT4", df$Female_parent))

sum(grepl("YAB JAT2", df$Male_parent))
sum(grepl("YAB JAT2", df$Female_parent))
df$Male_parent <- gsub("YAB JAT2", "YAB_JAT2", df$Male_parent)
df$Female_parent <- gsub("YAB JAT2", "YAB_JAT2", df$Female_parent)

sum(grepl("YAB_JAT2", df$Male_parent))
sum(grepl("YAB_JAT2", df$Female_parent))


sum(grepl("SFS 150", df$Male_parent))
sum(grepl("SFS 150", df$Female_parent))
sum(grepl("SFS150", df$Male_parent))
sum(grepl("SFS150", df$Female_parent))

df$Female_parent <- gsub("SFS 150", "SFS150", df$Female_parent)
df$Male_parent <- gsub("SFS 150", "SFS150", df$Male_parent)

sum(grepl("C.irrawadiensis", df$Male_parent))
sum(grepl("C.irrawadiensis", df$Female_parent))

sum(grepl("C.Irrawadiensis", df$Male_parent))
sum(grepl("C.Irrawadiensis", df$Female_parent))

df$Male_parent <- gsub("C.irrawadiensis", "C.Irrawadiensis", df$Male_parent)
df$Female_parent <- gsub("C.irrawadiensis", "C.Irrawadiensis", df$Female_parent)

sum(grepl("C.Irrawadiensis", df$Male_parent))
sum(grepl("C.Irrawadiensis", df$Female_parent))

df$Male_parent<- trimws(df$Male_parent)
df$Female_parent<- trimws(df$Female_parent)
df$Clone_CODE <- trimws(df$Clone_CODE)

# Stats after processing 
length(unique(c(df$Female_parent)))
length(unique(c(df$Male_parent)))
length(intersect(unique(c(df$Female_parent)),unique(c(df$Male_parent))))
length(setdiff(unique(c(df$Female_parent)),unique(c(df$Male_parent))))
length(setdiff(unique(c(df$Male_parent)),unique(c(df$Female_parent))))


## Drawing Venn Diagram - Unique Parents After 

set1 <- unique(df$Male_parent)
set2 <- unique(df$Female_parent)
png("parents_after_venn.png", width = 800, height = 800)

venn.plot <- draw.pairwise.venn(
  length(set1),
  length(set2),
  length(intersect(set1, set2)),
  category = c("Males", "Female"),
  fill = c("skyblue", "lightpink"),
  cex = 1.5,
  cat.cex = 1.5,
  cat.pos = 0,
  scaled = FALSE
)

grid.draw(venn.plot)
dev.off()





## Checking that there are no rows with spaces left 
rows_with_spaces <- df[apply(df[cols_to_check], 1, function(row) any(grepl(" ", row))), ]

unique(c(df$Female_parent))
unique(c(df$Male_parent))


# Make a copy to overwrite changes
clean_df<- df


### ----------- Entries with no grand-parental info
## Selecting parental entries
cols_to_check <- c("Male_parent","Female_parent")
cols_to_fix <- c("F_G_Female", "F_G_Male", "M_G_Female", "M_G_Male")

# Getting all entries that do not have grandparents (first Generation - F1)
subset_ancestors2 <- df %>%
  filter(if_all(all_of(cols_to_fix), is.na))
nrow(subset_ancestors2)


# Getting founder(?) population - Entries with no parents (that are parents themselves)
founder_male <- unique(subset_ancestors2$Male_parent)
founder_female <- unique(subset_ancestors2$Female_parent)

founders <- unique(c(founder_male,founder_female))

length(founders)


# Entries with no parents (Gen 0)
subset_parents <- df %>%
  filter(if_all(all_of(cols_to_check), is.na))
nrow(subset_parents)

# Getting lists of F1 unique parents - potential ancestors
unique_parents<- unique(c(subset_ancestors2$Female_parent, subset_ancestors2$Male_parent))
length(unique_parents)



# Compare against clone codes - find those that have clone entries already
# These directly match clone entries 
unique_ancestors<-intersect(unique_parents, df$Clone_CODE)
length(unique_ancestors) # 52


# compare against entries with no parental entries 
# Gets ancestoral plants that have entry 
entry_ancestors<-intersect(unique_ancestors,subset_ancestors$Clone_CODE)
length(entry_ancestors)


# Getting those that do have entry 
erroneous_clone<-setdiff(unique_ancestors,entry_ancestors)
length(erroneous_clone)

# remove errors from list of unique parents
all_ancestors<-setdiff(unique_parents, erroneous_clone)
length(all_ancestors)


# How many match the Clone code format? 
pattern <- "^\\d{7}[a-zA-Z]?$"
matches <- grepl(pattern,unique_parents)
matched <- unique_parents[matches]
length(matched)

pattern <- "^\\d{6}[a-zA-Z]?$"
matches <- grepl(pattern,unique_parents)
matched2 <- unique_parents[matches]
length(matched2)

all_matched<-c(matched,matched2)

# Comparing those that had a clone entry to those that match the clone code format

# Those that match and have a direct clone entry (before processing)
setdiff(all_matched,erroneous_clone)
length(setdiff(all_matched,erroneous_clone))



#####--------------------CLONE CODES--------------------------------------------------

### Processing Clone Codes 

# Getting clones that DON'T follow 7 digit with optional additional letter format
invalid_clones <- df[!grepl("^\\d{7}[a-zA-Z]?$", df$Clone_CODE), ]
nrow(invalid_clones)

# Getting clones that DON'T follow 7 digit with optional additional letter format &
# additional digit (identical twins) N = 1338
invalid_clones_2 <- df[!grepl("^\\d{7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(invalid_clones_2)



# Getting clones that DON'T follow 6 OR 7 digit with optional additional letter format &
# additional digit (identical twins) N = 265
invalid_clones_6 <- df[!grepl("^\\d{6}([a-zA-Z]\\d?)?$|^\\d{7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(invalid_clones_6)
invalid_IDs <- unique(invalid_clones_6$Clone_CODE)
length(invalid_IDs)

# Comparing against parents entries




subset_invalid_filtered2 <- invalid_clones_2 %>%
  filter(
    grepl("^0\\d{5}([a-zA-Z]\\d?)?$", Clone_CODE),
    !(Clone_CODE %in% subset_ancestors)
  )
nrow(subset_invalid_filtered2)






## CORRECTLY formatted clones 

# Number of clones that follow 6 digit with optional additional letter format &
# additional digit (identical twins) N = 1073
valid_clones_6 <- df[grepl("^\\d{6}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones_6)
valid_clones_6$Clone_CODE

# Getting clones that DO follow 7 digit with optional additional letter format &
# additional digit (identical twins) N = 46526
valid_clones_7 <- df[grepl("^\\d{7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones_7)
valid_clones_7$Clone_CODE


parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)


length(setdiff(parents,valid_clones_7$Clone_CODE))
length(intersect(parents,valid_clones_7$Clone_CODE)) ## N = 116 used as parents


length(setdiff(parents,valid_clones_6$Clone_CODE))
length(intersect(parents,valid_clones_6$Clone_CODE))## None used as parents 

# Getting invalid clone with correct 6 digit format and starting with "0" 
# Entries missing "0" at start -- many of the 2000 year entries 
# And isnt present in ancestor list
subset_zero_sixdigits <- invalid_clones_2[
  grepl("^0\\d{5}([a-zA-Z]\\d?)?$", invalid_clones_2$Clone_CODE) &
    !(invalid_clones_2$Clone_CODE %in% subset_ancestors),]
nrow(subset_zero_sixdigits)


## Getting those with valid 6 digit code that doesnt start with 0 
subset_valid6_0 <- valid_clones_6[
  grepl("^0\\d{5}([a-zA-Z]\\d?)?$", valid_clones_6$Clone_CODE) &
    !(valid_clones_6$Clone_CODE %in% subset_ancestors),]
nrow(subset_valid6_0)

setdiff(valid_clones_6$Clone_CODE,subset_valid6_0$Clone_CODE)
intersect(parents,subset_valid6_0$Clone_CODE) ## None used as parents 


# ADD 0 to these entries 
clean_zero_sixdigits <-subset_zero_sixdigits
clean_zero_sixdigits$Clone_CODE <- paste0("0", subset_zero_sixdigits$Clone_CODE)

intersect(parents,subset_valid6_0$Clone_CODE)
intersect(parents,clean_zero_sixdigits$Clone_CODE)


setdiff(clean_zero_sixdigits$Clone_CODE,parents)
length(setdiff(parents,clean_zero_sixdigits$Clone_CODE))

### --------- Overwriting with updated format clone IDs --------------

# Getting parallel row ids 
row_ids <- rownames(clean_zero_sixdigits)
# Replacing in clean data frame 
clean_df[row_ids, ] <-clean_zero_sixdigits

# Checking row_ids match
all(rownames(df) == rownames(clean_df))

### --------- Performing another Round of formatting checks--------------

# Performing another round of format checking - to standard 7 digit (+ letter + digit)
# And not an ancestral clone entry (no parental info)
invalid_clones_2_clean <- clean_df[
  !grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Clone_CODE) &
    !(clean_df$Clone_CODE %in% subset_ancestors$Clone_CODE),
]

nrow(invalid_clones_2_clean)

### Identifying clones with additional "/"
# Getting clones that follow 7 digit with optional additional '/' &
# additional digit (identical twins)

subset_2 <- clean_df[grepl("^\\d{7}[a-zA-Z]/\\d+$", clean_df$Clone_CODE), ]
nrow(subset_2)


## Removing  "/" 
clean_subset_2 <- subset_2
clean_subset_2$Clone_CODE <- gsub("/", "", clean_subset_2$Clone_CODE)


## Identifying clones 

# Getting clones that follow 7 digit with optional additional '/' &
# additional digit (identical twins)
subset_3 <- clean_df[grepl("^\\d{7}/\\d+$", clean_df$Clone_CODE), ]
nrow(subset_3)

# Checking if used for breeding 
clone_ids <- subset_3$Clone_CODE
parents <- c(clean_df$Female_parent,clean_df$Male_parent)
intersect(clone_ids, parents)


## Replacing "/" with 'a'
## Entries of identical twins with "/" instead of letter
#clean_subset_3 <- subset_3
#clean_subset_3$Clone_CODE <- gsub("/", "a", clean_subset_3$Clone_CODE)


### --------- Overwriting with updated format clone IDs --------------

# Getting parallel row ids 
row_ids_2 <- rownames(clean_subset_2)
#row_ids_3 <- rownames(clean_subset_3)
# Replacing in clean data frame 
clean_df[row_ids_2, ] <-clean_subset_2
#clean_df[row_ids_3, ] <-clean_subset_3

## Checking df again for correct 7 digit format 
invalid_clones_3_clean <- clean_df[
  !grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Clone_CODE) &
    !(clean_df$Clone_CODE %in% subset_ancestors$Clone_CODE),
]

nrow(invalid_clones_3_clean)

## Getting all those with 6 digit format 
subset_6digits <- invalid_clones_3_clean [
  grepl("^\\d{6}([a-zA-Z]\\d?)?$", invalid_clones_3_clean$Clone_CODE) &
    !(invalid_clones_3_clean$Clone_CODE %in% subset_ancestors),]
nrow(subset_6digits)


pattern<- "985929A"

# Searching all the columns in the dataframe
df_char <- data.frame(lapply(clean_df, as.character), stringsAsFactors = FALSE)
matched_rows <- apply(df_char, 1, function(row) any(grepl(pattern, row, ignore.case = TRUE)))
result_df <- clean_df[matched_rows, ]
print(result_df)


##subset_6digits_clean<- subset_6digits
##subset_6digits_clean$Clone_CODE <- paste0("0", subset_6digits$Clone_CODE)


# Getting parallel row ids 
row_ids_6 <- rownames(subset_6digits_clean)
# Replacing in clean data frame 
clean_df[row_ids_6, ] <-subset_6digits_clean

# Checking row_ids match
all(rownames(df) == rownames(clean_df))



### ROUND 4 
## Checking df again for correct 7 digit format 
invalid_clones_4_clean <- clean_df[
  !grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Clone_CODE) &
    !(clean_df$Clone_CODE %in% subset_ancestors$Clone_CODE),
]
nrow(invalid_clones_4_clean)


## Manually changing some of the clone code back to convention 
## removing repeats 
## adding lost "0"s
clean_df$Clone_CODE[clean_df$Clone_CODE == "21016771677"] <- "2101677"
clean_df$Clone_CODE[clean_df$Clone_CODE == "21050925092"] <- "2105092"
clean_df$Clone_CODE[clean_df$Clone_CODE == "080003232"] <- "0800032"
clean_df$Clone_CODE[clean_df$Clone_CODE == "05077567756"] <- "0507756"
clean_df$Clone_CODE[clean_df$Clone_CODE == "0203441BB"] <- "0203441B"
clean_df$Clone_CODE[clean_df$Clone_CODE == "1824A"] <- "0001824A"
clean_df$Clone_CODE[clean_df$Clone_CODE == "9816269bB"] <- "9816269B"


## Removing any whitespace 
clean_df$Clone_CODE <- gsub(" ", "", clean_df$Clone_CODE)


## Identifying clones that dont match 7digit + optional letter or / + optional digit 
invalid_clones_5_clean <- clean_df[
  !grepl("^\\d{7}([a-zA-Z/]\\d?)?$", clean_df$Clone_CODE) &
    !(clean_df$Clone_CODE %in% subset_ancestors$Clone_CODE),
]
nrow(invalid_clones_5_clean)

# Manual searching 
pattern<- "98151556B"
# Searching all the columns in the dataframe
df_char <- data.frame(lapply(clean_df, as.character), stringsAsFactors = FALSE)
matched_rows <- apply(df_char, 1, function(row) any(grepl(pattern, row, ignore.case = TRUE)))
result_df <- clean_df[matched_rows, ]
print(result_df)


# Getting all clone that are used as parents
unique_clean_parents<- unique(c(clean_df$Female_parent, clean_df$Male_parent))
length(unique_clean_parents)

# Changing all clones to lower case (except ancestors)
to_change <- !(clean_df$Clone_CODE %in% subset_ancestors$Clone_CODE)
clean_df$Clone_CODE[to_change] <- tolower(clean_df$Clone_CODE[to_change])



invalid_clones_6_clean <- clean_df[
  !grepl("^\\d{7}([a-zA-Z/]\\d?)?$", clean_df$Clone_CODE) &
    !(clean_df$Clone_CODE %in% subset_ancestors$Clone_CODE),
]
nrow(invalid_clones_6_clean)

invalid_clones_6_clean$Clone_CODE 


# Manually searching resulting clones
# Check whether they are required for breeding 
pattern<- "1601645/2"

# Searching all the columns in the dataframe
df_char <- data.frame(lapply(clean_df, as.character), stringsAsFactors = FALSE)
matched_rows <- apply(df_char, 1, function(row) any(grepl(pattern, row, ignore.case = TRUE)))
result_df <- clean_df[matched_rows, ]
print(result_df)

# Also test the removal of additional 0 - had no change 
# Determined that these clones are non-consequential 


# Final number of clones that dont match 7 digit + optional letter or / + optional digit

nrow(clean_df[
  !grepl("^\\d{7}([a-zA-Z/]\\d?)?$", clean_df$Clone_CODE) &
    !(clean_df$Clone_CODE %in% subset_ancestors$Clone_CODE),
])



################# FORMATTING PARENTS #######################
# ------- Formatting Female parents -----------

clean_df$Female_parent <- as.character(clean_df$Female_parent)
# Apply lowercase only to matching values
clean_df$Female_parent <- ifelse(
  grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Female_parent),
  tolower(clean_df$Female_parent),
  clean_df$Female_parent
)
length(unique(clean_df$Female_parent))

# Getting parents that are not in valid clone format 
invalid_parents_f <- unique(clean_df$Female_parent[
  !grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Female_parent)
])




# Getting parents that are in valid clone format 
valid_parents_f <- unique(clean_df$Female_parent[
  grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Female_parent)
])


## Converting to lowercase format 
valid_parents_f<-tolower(valid_parents_f)
# Compare against list of clones -- check if there a non mismatching
clones <- clean_df$Clone_CODE

## Finding parental clones-formated entries that are not present as clone entries
setdiff(valid_parents_f,clones)
absent_parent_clones_f<-setdiff(valid_parents_f,clones)

cols_to_search <- c("Clone_CODE", "Male_parent", "Female_parent")
matched_rows <- clean_df[
  apply(clean_df[ , cols_to_search], 1, function(row) any(row %in% absent_parent_clones_f)),
]
nrow(matched_rows)

#Manually searching
pattern<- "9813644c"

# Searching all the columns in the dataframe
df_char <- data.frame(lapply(clean_df, as.character), stringsAsFactors = FALSE)
matched_rows <- apply(df_char, 1, function(row) any(grepl(pattern, row, ignore.case = TRUE)))
result_df <- clean_df[matched_rows, ]
print(result_df)

## Both the clones Identified seemed first generation (externally sourced) 
## where not edited.




# Getting parents that are 6 digits -- missing 0?
invalid_parents_6digits_f <- unique(clean_df$Female_parent[
  grepl("^\\d{6}([a-zA-Z]\\d?)?$", clean_df$Female_parent)
])
# Getting partial matches to clones
invalid_parents_6digits_f<-tolower(invalid_parents_6digits_f)
length(invalid_parents_6digits_f)

matches <- clones %in% invalid_parents_6digits_f
matched_values_f <- clones[matches]

strip_leading_zeros <- function(x) sub("^0+", "", x)

clones_stripped <- strip_leading_zeros(clones)
invalid_stripped <- strip_leading_zeros(invalid_parents_6digits_f)

matches <- clones_stripped %in% invalid_stripped
matched_values_f <- clones[matches]

length(invalid_parents_6digits_f)
length(matched_values_f)
length(invalid_parents_6digits_f)==length(matched_values_f)



# Getting female_parent matches the pattern (6 digits)
matches <- grepl("^\\d{6}([a-zA-Z]\\d?)?$", clean_df$Female_parent)
# Adding 0
clean_df$Female_parent[matches] <- tolower(paste0("0", clean_df$Female_parent[matches]))

# Subset full rows of clean_df - checking if they have been changed correctly.
invalid_rows_6digits_f <- clean_df[matches, ]


# ------- Formatting Male parents -----------

clean_df$Male_parent <- as.character(clean_df$Male_parent)
# Apply lowercase only to matching values
clean_df$Male_parent <- ifelse(
  grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Male_parent),
  tolower(clean_df$Male_parent),
  clean_df$Male_parent
)

length(unique(clean_df$Male_parent))

# Getting parents that are not in valid clone format 
invalid_parents_m <- unique(clean_df$Male_parent[
  !grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Male_parent)
])

length(unique(invalid_parents_m))


invalid_parents_2<- unique(clean_df$Male_parent)
absent_clones_m<-setdiff(invalid_parents_2,clones)

# Compare this against all known ancestors
setdiff(all_ancestors,absent_clones_m)



# Getting parents that are in valid clone format 
valid_parents_m <- unique(clean_df$Male_parent[
  grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Male_parent)
])


## Finding parental clones-formated entries that are not present as clone entries

absent_parent_clones_m<-setdiff(valid_parents_m,clones)


## Finding child entries for parental clones that do not have entry 
matched_rows_m <- clean_df[
  apply(clean_df[ , cols_to_search], 1, function(row) any(row %in% absent_parent_clones_m)),
]
nrow(matched_rows_m)


# Manually searching resulting clones
# Check whether they are required for breeding 
pattern<- "0006205a"

# Searching all the columns in the dataframe
df_char <- data.frame(lapply(clean_df, as.character), stringsAsFactors = FALSE)
matched_rows <- apply(df_char, 1, function(row) any(grepl(pattern, row, ignore.case = TRUE)))
result_df <- clean_df[matched_rows, ]
print(result_df)

# Also test the removal of additional a - had no change 
# Determined these clone are first generation - with resulting children --> 
# therefore essential for correct graphing
# Additional a added 

matched_rows <- clean_df$Male_parent %in% absent_parent_clones_m
clean_df$Male_parent[matched_rows] <- paste0(clean_df$Male_parent[matched_rows], "a")

# Checking again
matched_rows_m <- clean_df[
  apply(clean_df[ , cols_to_search], 1, function(row) any(row %in% absent_parent_clones_m)),
]
nrow(matched_rows_m)



# Getting parents that are 6 digits -- missing 0?
invalid_parents_6digits_m <- unique(clean_df$Male_parent[
  grepl("^\\d{6}([a-zA-Z]\\d?)?$", clean_df$Male_parent)
])
length(invalid_parents_6digits_m)
# Getting partial matches to clones
invalid_parents_6digits_m<-tolower(invalid_parents_6digits_m)

## Checking if they match clone IDs with added 0 at front
matches <- clones %in% invalid_parents_6digits_m
matched_values_m <- clones[matches]
strip_leading_zeros <- function(x) sub("^0+", "", x)

clones_stripped <- strip_leading_zeros(clones)
invalid_stripped <- strip_leading_zeros(invalid_parents_6digits_m)

matches <- clones_stripped %in% invalid_stripped
matched_values_m <- clones[matches]


## Checking they are the same length -- Have they all been matched to clones?
length(invalid_parents_6digits_m)
length(matched_values_m)

length(invalid_parents_6digits_m)==length(matched_values_m)

# Getting Male_parent matches the pattern (6 digits)
matches <- grepl("^\\d{6}([a-zA-Z]\\d?)?$", clean_df$Male_parent)
# Adding 0
clean_df$Male_parent[matches] <- tolower(paste0("0", clean_df$Male_parent[matches]))

# Subset full rows of clean_df
invalid_rows_6digits_m <- clean_df[matches, ]




### ---------- Second Roound of parent clone cleaning ------------



# Getting parents that are not in valid clone format 
invalid_parents_f <- unique(clean_df$Female_parent[
  !grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Female_parent)
])
length(invalid_parents_f)


invalid_parents_m <- unique(clean_df$Male_parent[
  !grepl("^\\d{7}([a-zA-Z]\\d?)?$", clean_df$Male_parent)
])
length(invalid_parents_m)

# comparison to all_ancestors
setdiff(setdiff(clean_df$Female_parent,clones), all_ancestors)
setdiff(setdiff(clean_df$Male_parent,clones), all_ancestors)


# Getting all entries that do not have grandparents (first Generation - F1)
ancestors<- clean_df %>%
  filter(if_all(all_of(cols_to_fix), is.na))

# Getting lists of F1 unique parents - potential ancestors
unique_parents<- unique(c(ancestors$Female_parent,ancestors$Male_parent))
length(unique_parents)

# Compare against clone codes - find those that have clone entries already
unique_ancestors<-intersect(unique_parents, clean_df$Clone_CODE)
print(unique_ancestors)

unique_ancestors<-setdiff(unique_parents, clean_df$Clone_CODE)
print(unique_ancestors)


# Manually searching resulting clones
# Check whether they are required for breeding 
pattern<- "9501524a"

# Searching all the columns in the dataframe
df_char <- data.frame(lapply(clean_df, as.character), stringsAsFactors = FALSE)
matched_rows <- apply(df_char, 1, function(row) any(grepl(pattern, row, ignore.case = TRUE)))
result_df <- clean_df[matched_rows, ]
print(result_df)


# Manually changing some entries 
clean_df$Male_parent[clean_df$Male_parent == "7156"] <- "0007156"
clean_df$Male_parent[clean_df$Male_parent == "6205"] <- "0006205a"


# Getting all entries that do not have grandparents (first Generation - F1)
ancestors<- clean_df %>%
  filter(if_all(all_of(cols_to_fix), is.na))

# Getting lists of F1 unique parents - potential ancestors
unique_parents<- unique(c(ancestors$Female_parent,ancestors$Male_parent))
length(unique_parents)

# Compare against clone codes - find those that have clone entries already
unique_ancestors<-setdiff(unique_parents, clean_df$Clone_CODE)
length(unique_ancestors)


#### Subsetting only parents and children (removing Grand-parents)

final_df <- clean_df[, c("Clone_CODE", "Female_parent", "Male_parent")]


length(unique(c(final_df$Female_parent)))
length(unique(c(final_df$Male_parent)))

length(unique(c(final_df$Clone_CODE)))






## Removal of twins - how many are left?

## ------ NUMBER OF TWINS - TWIN NO.2
matched_rows <- grepl("^\\d{7}[a-zA-Z]2$",final_df$Clone_CODE)
# Get matching rows
matching_df <- final_df[matched_rows, ]
nrow(matching_df)


#### -------- TWIN NO.2 AS PARENTS
## Checking Twins ending in letter + "2" aren't used as parents 
matched_rows <- grepl("^\\d{7}[a-zA-Z]2$",final_df$Male_parent)
# Get matching rows
matching_df <- final_df[matched_rows, ]
nrow(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z]|/)?2$",final_df$Male_parent)
# Get matching rows
matching_df <- final_df[matched_rows, ]
nrow(matching_df)


matched_rows <- grepl("^\\d{7}[a-zA-Z]2$",final_df$Female_parent)
# Get matching rows
matching_df <- final_df[matched_rows, ]
nrow(matching_df)

## No No.2 twins used as parents -- they can be removed without consequence




matched_rows <- grepl("^\\d{7}[a-zA-Z]1$",final_df$Clone_CODE)
# Get matching rows
matching_df <- final_df[matched_rows, ]
nrow(matching_df)

#### -------- NO PARENTS ARE TWINS 
## Checking Twins ending in letter + "1" aren't used as parents 
matched_rows <- grepl("^\\d{7}[a-zA-Z]1$",final_df$Male_parent)
# Get matching rows
matching_df <- final_df[matched_rows, ]
nrow(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z]|/)?1$",final_df$Male_parent)
# Get matching rows
matching_df <- final_df[matched_rows, ]
nrow(matching_df)

matched_rows <- grepl("^\\d{7}[a-zA-Z]1$",final_df$Female_parent)
# Get matching rows
matching_df <- final_df[matched_rows, ]
nrow(matching_df)

## No No.1 twins used as parents - 0




#### CHECKING FOR PROPORTIONS OF SIBLINGS

male <- as.character(final_df$Male_parent)
female <- as.character(final_df$Female_parent)
# Combine both columns
all_parents <- c(male, female)


###------------------------ ALL
# Checking how many entries have parents that are clones with siblings 

pattern <- "^\\d{7}([a-zA-Z]|/)$"
# Matching 7digit followed by letter OR /

matches <- grepl(pattern, final_df$Male_parent) | grepl(pattern, final_df$Female_parent)
matching_df <- final_df[matches, ]
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

write.table(ranked_counts, file = "ranked_counts.txt", sep = "\t", row.names = FALSE, quote = FALSE)




###------------------------ A
# Checking how many entries have parents are clones - sibling a
pattern <- ("^\\d{7}[aA]\\d?$")

matches <- grepl(pattern, final_df$Male_parent) | grepl(pattern, final_df$Female_parent)
matching_df <- final_df[matches, ]
nrow(matching_df)
# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)


###------------------------ B
# Checking how many entries have parents are clones - sibling b
pattern <- ("^\\d{7}[bB]\\d?$")

matches <- grepl(pattern, final_df$Male_parent) | grepl(pattern, final_df$Female_parent)
matching_df <- final_df[matches, ]
nrow(matching_df)
# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)


###------------------------ C
# Checking how many entries have parents are clones - sibling c
pattern <- ("^\\d{7}[cC]\\d?$")

matches <- grepl(pattern, final_df$Male_parent) | grepl(pattern, final_df$Female_parent)
matching_df <- final_df[matches, ]
nrow(matching_df)
# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)


###------------------------ D
# Checking how many entries have parents are clones - sibling d
pattern <- ("^\\d{7}[dD]\\d?$")

matches <- grepl(pattern, final_df$Male_parent) | grepl(pattern, final_df$Female_parent)
matching_df <- final_df[matches, ]
nrow(matching_df)
# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)


###------------------------ E
# Checking how many entries have parents are clones - sibling e
pattern <- ("^\\d{7}[eE]\\d?$")

matches <- grepl(pattern, final_df$Male_parent) | grepl(pattern, final_df$Female_parent)
matching_df <- final_df[matches, ]
nrow(matching_df)

# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)


###------------------------ F
# Checking how many entries have parents are clones - sibling e
pattern <- ("^\\d{7}[fF]\\d?$")

matches <- grepl(pattern, final_df$Male_parent) | grepl(pattern, final_df$Female_parent)
matching_df <- final_df[matches, ]
nrow(matching_df)

# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)

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
  matches <- grepl(pattern, final_df$Male_parent) | grepl(pattern, final_df$Female_parent)
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


write.table(results, file = "sibling_counts.txt", sep = "\t", row.names = FALSE, quote = FALSE)




# Comparing clones to parents

clones<- final_df$Clone_CODE
length(unique(clones))
all_parents<-unique(all_parents)
length(all_parents)


# Clones entries that match and are used as parents 
length(intersect(all_parents,clones))


length(setdiff(union(clones,all_parents), intersect(clones, all_parents)))


length(all_parents)


length(unique(c(df$Female_parent)))
length(unique(c(df$Male_parent)))
length(intersect(unique(c(df$Female_parent)),unique(c(df$Male_parent))))
length(setdiff(unique(c(df$Female_parent)),unique(c(df$Male_parent))))
length(setdiff(unique(c(df$Male_parent)),unique(c(df$Female_parent))))



### SYNBREED 


str(final_df)

sum(is.na(final_df))
sum(is.na(final_df$Clone_CODE))
sum(is.na(final_df$Female_parent))
sum(is.na(final_df$Male_parent))



sum(!complete.cases(final_df))
final_df[!complete.cases(final_df),]


## Finding and removing duplicates
## duplicated were first assessed as to impact for pedigree
## Where they used as parents?

# Only 1 duplicate , not used for breeding 
# removed first incidence 


all_dups <- duplicated(final_df$Clone_CODE)

# Find duplicated rows from the end (all except last occurrence)
dups_from_last <- duplicated(final_df$Clone_CODE, fromLast = TRUE)

# The "first duplicate" is the one that is duplicated from front but NOT duplicated from last
first_duplicates <- all_dups & !dups_from_last

# Remove those first duplicates
final_df<- final_df[!first_duplicates, ]


ped <- create.pedigree(
  ID=final_df$Clone,
  Par1=final_df$Female_parent,
  Par2=final_df$Male_parent,
  add.ancestors=T) # adding ancestors that dont occur in pedigree/ have no entry 



write.table(ped, "pedigree.txt", 
            sep="\t", row.names = F, quote= F)


gp <- create.gpData(pedigree=ped)



summary(gp)

## Performing Kinship Matrix 
kinship.mx <- kin(gp)

write.csv(kinship.mx, file = "kinship_matrix.csv", row.names = TRUE)

#write.table(kinship.mx, file = "kinship_matrix.txt", sep = "\t", quote = FALSE, row.names = TRUE, col.names = NA)


# Generating Generation table 
table(ped$gener)

# Number of Ancestoral entries added 
nrow(ped) - nrow(final_df)




# Writing a function to extract the lineage of a specific 3rd Generation clone

get_lineage <- function(ped_df, id, generations = 4) {
  ped_df[] <- lapply(ped_df, as.character)  # ensure all columns are character
  lineage <- list()
  current <- id
  
  for (gen in 1:generations) {
    parents <- lapply(current, function(ind) {
      match_row <- ped_df[ped_df$Clone_CODE == ind, ]
      if (nrow(match_row) == 0) return(NULL)
      c(match_row$Female_parent, match_row$Male_parent)
    })
    current <- unique(na.omit(unlist(parents)))
    lineage[[gen]] <- current
    if (length(current) == 0) break
  }
  
  names(lineage) <- paste0("Gen_", 1:length(lineage))
  return(lineage)
}

lineage <- get_lineage(final_df, id = "2102798a", generations = 4)
print(lineage)



## Exploring pedigree



## Generation 1
gen1<- ped[ped$gener == 1, ]

# View them
print(gen1)

length(unique(gen1$ID))
first_two_digits <- substr(gen1$ID, 1, 2)

# If you want unique first two digits only
unique_first_two <- unique(first_two_digits)

unique_parents1<-unique(gen1$Par1,gen1$Par2)
length(intersect(gen1$Par1,gen1$Par2))
length(unique_parents1)


## Generation 2
gen2<- ped[ped$gener == 2, ]
print(gen2)

# Getting Number in generation
length(unique(gen2$ID))
# Selecting year prefix 
first_two_digits <- substr(gen2$ID, 1, 2)


unique_first_two <- unique(first_two_digits)
print(unique_first_two)

# Getting unique parents
unique_parents2<-unique(gen2$Par1,gen2$Par2)
length(intersect(gen2$Par1,gen2$Par2))
length(unique_parents2)


## Generation 3
gen3<- ped[ped$gener == 3, ]
print(gen3)

# Getting Number in generation
length(unique(gen3$ID))
# Selecting year prefix 
first_two_digits <- substr(gen3$ID, 1, 2)

unique_first_two <- unique(first_two_digits)
print(unique_first_two)

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



library(VennDiagram)
library(grid)

# Your sets
set1 <- unique_parents1
set2 <- unique_parents2
set3 <- unique_parents3

# Open the PNG device
png("venn_diagram.png", width = 800, height = 800)

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
