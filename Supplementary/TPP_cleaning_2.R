### Jennifer O'Halloran

## Processing Script 
## Exploration and Cleaning of original Data 
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



data <- read.xlsx("HPT_Clones_Edited.xlsx", sheet = 1)

# Removing any "NA" clone entries 
df <- data%>%filter(!is.na(Clone_CODE))

# Replacing "-" with na 
cols_to_fix <- c("F_G_Female", "F_G_Male", "M_G_Female", "M_G_Male")


df[cols_to_fix] <- lapply(df[cols_to_fix], function(x) {
  replace(x, x == "-", NA)
})


## Ensuring all are character types
df$Clone_CODE <- as.character(df$Clone_CODE)
df$F_G_Female<- as.character(df$F_G_Female)
df$M_G_Female<- as.character(df$M_G_Female)
df$M_G_Male<- as.character(df$M_G_Male)
df$F_G_Male<- as.character(df$F_G_Male)
df$Male_parent<- as.character(df$Male_parent)
df$Female_parent<- as.character(df$Female_parent)




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


parents <- unique(c(df$Female_parent,df$Male_parent))
length(parents)

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
sum(grepl("YAB_JAT4", df$Male_parent))
sum(grepl("YAB_JAT4", df$Female_parent))

df$Male_parent <- gsub("YAB JAT4", "YAB_JAT4", df$Male_parent)
df$Female_parent <- gsub("YAB JAT4", "YAB_JAT4", df$Female_parent)

sum(grepl("YAB_JAT4", df$Male_parent))
sum(grepl("YAB_JAT4", df$Female_parent))

sum(grepl("YAB JAT2", df$Male_parent))
sum(grepl("YAB JAT2", df$Female_parent))
sum(grepl("YAB_JAT2", df$Male_parent))
sum(grepl("YAB_JAT2", df$Female_parent))
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

sum(grepl("SFS150", df$Male_parent))
sum(grepl("SFS150", df$Female_parent))


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


parents <- unique(c(df$Female_parent,df$Male_parent))
length(parents)
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
length(unique(c(df$Female_parent)))
unique(c(df$Male_parent))
length(unique(c(df$Male_parent)))

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


## Number/ list of parents used as both dam and sire 
intersect(founder_male,founder_female)
length(intersect(founder_male,founder_female)) 

# Entries with no parents (Gen 0)
subset_parents <- df %>%
  filter(if_all(all_of(cols_to_check), is.na))
nrow(subset_parents) # n = 84 



# Getting lists of F1 unique parents - potential ancestors
unique_parents<- unique(c(subset_ancestors2$Female_parent, subset_ancestors2$Male_parent))
length(unique_parents) # n = 143



# Compare against clone codes - find those that have clone entries already
# These directly match clone entries 
unique_ancestors<-intersect(unique_parents, df$Clone_CODE)
length(unique_ancestors) # 52


# compare against entries with no parental entries 
# Gets ancestoral plants that have entry 
entry_ancestors<-intersect(unique_ancestors,subset_ancestors$Clone_CODE)
length(entry_ancestors) # N = 3 



parents <- unique(c(df$Female_parent,df$Male_parent))
female_parents <-unique(df$Female_parent)
male_parents <-unique(df$Male_parent)
length(parents)
length(female_parents)
length(male_parents)



# Getting those that do have entry 
erroneous_clone<-setdiff(unique_ancestors,entry_ancestors)
length(erroneous_clone) # N = 49


# remove errors from list of unique parents
all_ancestors<-setdiff(unique_parents, erroneous_clone)
length(all_ancestors) # N = 94


# How many match the Clone code format? 
pattern <- "^\\d{7}[a-zA-Z]?$"
matches <- grepl(pattern,unique_parents)
matched <- unique_parents[matches]
length(matched)# N = 57

pattern <- "^\\d{6}[a-zA-Z]?$"
matches <- grepl(pattern,unique_parents)
matched2 <- unique_parents[matches]
length(matched2)# N = 9

all_matched<-c(matched,matched2)

# Comparing those that had a clone entry to those that match the clone code format

# Those that match and have a direct clone entry (before processing)
setdiff(all_matched,erroneous_clone)
length(setdiff(all_matched,erroneous_clone))# N = 17




#####--------------------CLONE CODES--------------------------------------------------

### Exploring Clone Codes - BEFORE CASE CHANGE 


## CORRECTLY formatted clones 

# Number of clones that DO follow 6 digit with optional additional letter format &
# additional digit (identical twins) N = 1073
valid_clones_6 <- df[grepl("^\\d{6}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones_6)
valid_clones_6$Clone_CODE

# Getting clones that DO follow 7 digit with optional additional letter format &
# additional digit (identical twins) N = 46526
valid_clones_7 <- df[grepl("^\\d{7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones_7)
valid_clones_7$Clone_CODE


# Match either 6 or 7 digits with optional additional letter format &
# additional digit (identical twins)
valid_clones_both <- df[grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones_both)



## INCORRECTLY formatted clones 

# Getting clones that DON'T follow 7 digit with optional additional letter format
invalid_clones <- df[!grepl("^\\d{7}[a-zA-Z]?$", df$Clone_CODE), ] # n = 1534
nrow(invalid_clones)

# Getting clones that DON'T follow 7 digit with optional additional letter format &
# additional digit (identical twins) N = 1338
invalid_clones_2 <- df[!grepl("^\\d{7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(invalid_clones_2)


# Getting clones that DON'T follow 6 or 7 digit with optional additional letter format &
# additional digit (identical twins) N = 266
invalid_clones_both <- df[!grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(invalid_clones_both)



# Getting all Parents
parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)

# Comparing Valid Clone Code to parents 
length(setdiff(parents,valid_clones_7$Clone_CODE))
length(intersect(parents,valid_clones_7$Clone_CODE)) ## N = 116 used as parents

length(setdiff(parents,valid_clones_6$Clone_CODE))
length(intersect(parents,valid_clones_6$Clone_CODE))## N = 0 used as parents 






### Exploring Clone Codes - AFTER CASE CHANGE 

# Changing all matched clone codes to lower case 

# Define the pattern
# Matching 6 or 7 digit + Letter (optional) + digit (optional)
pattern <- "^\\d{6}([a-zA-Z]\\d?)?$|^\\d{7}([a-zA-Z]\\d?)?$"


df$Clone_CODE <- ifelse(grepl(pattern, df$Clone_CODE),
                        tolower(df$Clone_CODE),
                        df$Clone_CODE)

df$Female_parent <- ifelse(grepl(pattern, df$Female_parent),
                            tolower(df$Female_parent),
                            df$Female_parent)

df$Male_parent <- ifelse(grepl(pattern, df$Male_parent),
                           tolower(df$Male_parent),
                           df$Male_parent)


## Redefining Parents
parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)


## CORRECTLY formatted clones 

# Number of clones that DO follow 6 digit with optional additional letter format &
# additional digit (identical twins) N = 1073
valid_clones_6_lc <- df[grepl("^\\d{6}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones_6_lc)
valid_clones_6_lc$Clone_CODE

# Getting clones that DO follow 7 digit with optional additional letter format &
# additional digit (identical twins) N = 46526
valid_clones_7_lc <- df[grepl("^\\d{7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones_7_lc)
valid_clones_7_lc$Clone_CODE


# Getting clones that DO follow 6 or 7 digit with optional additional letter format &
# additional digit (identical twins)
valid_clones_both_lc <- df[grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones_both_lc)




## INCORRECTLY formatted clones 

# Getting clones that DON'T follow 7 digit with optional additional letter format
invalid_clones_lc <- df[!grepl("^\\d{7}[a-zA-Z]?$", df$Clone_CODE), ]
nrow(invalid_clones_lc)

# Getting clones that DON'T follow 7 digit with optional additional letter format &
# additional digit (identical twins) N = 1338
invalid_clones_2_lc <- df[!grepl("^\\d{7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(invalid_clones_2_lc)


# Getting clones that DON'T follow 6 or 7 digit with optional additional letter format &
# additional digit (identical twins) 
invalid_clones_both_lc <- df[!grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(invalid_clones_both_lc)



# Comparing Valid Clone Code to parents 
length(setdiff(parents,valid_clones_7_lc$Clone_CODE)) ## N = 97 
length(intersect(parents,valid_clones_7_lc$Clone_CODE)) ## N = 130 used as parents


length(setdiff(parents,valid_clones_6_lc$Clone_CODE)) ## N = 226
length(intersect(parents,valid_clones_6_lc$Clone_CODE))## N =  1 used as parents 
## "000014b" Effected by letter casing 



# How many were changed due to letter casing? 

setdiff(valid_clones_6_lc$Clone_CODE,valid_clones_6$Clone_CODE)
length(setdiff(valid_clones_6_lc$Clone_CODE,valid_clones_6$Clone_CODE)) 
## effected N = 9 with 6 digit format

setdiff(valid_clones_7_lc$Clone_CODE,valid_clones_7$Clone_CODE)
length(setdiff(valid_clones_7_lc$Clone_CODE,valid_clones_7$Clone_CODE))
## effected N = 8729 with 7 digit format




## How did this effect founders??? 


# Getting founder(?) population - Entries with no parents (that are parents themselves)
founder_male <- unique(subset_ancestors2$Male_parent)
founder_female <- unique(subset_ancestors2$Female_parent)

founders <- unique(c(founder_male,founder_female))

length(founders) # N = 143


# Entries with no parents (Gen 0)
subset_parents <- df %>%
  filter(if_all(all_of(cols_to_check), is.na))
nrow(subset_parents)# N = 84

# Getting lists of F1 unique parents - potential ancestors
unique_parents<- unique(c(subset_ancestors2$Female_parent, subset_ancestors2$Male_parent))
length(unique_parents) # N = 143



# Compare against clone codes - find those that have clone entries already
# These directly match clone entries 
unique_ancestors<-intersect(unique_parents, df$Clone_CODE)
length(unique_ancestors) # N = 51


# compare against entries with no parental entries 
# Gets ancestoral plants that have entry 
entry_ancestors<-intersect(unique_ancestors,subset_ancestors$Clone_CODE)
length(entry_ancestors) # N = 3


# Getting those that do have entry 
erroneous_clone<-setdiff(unique_ancestors,entry_ancestors)
length(erroneous_clone) # N = 48

# remove errors from list of unique parents
all_ancestors<-setdiff(unique_parents, erroneous_clone)
length(all_ancestors) # N = 95


# How many match the Clone code format? 
pattern <- "^\\d{7}[a-zA-Z]?$"
matches <- grepl(pattern,unique_parents)
matched <- unique_parents[matches]
length(matched) # N = 57

pattern <- "^\\d{6}[a-zA-Z]?$"
matches <- grepl(pattern,unique_parents)
matched2 <- unique_parents[matches]
length(matched2) # N = 9

all_matched<-c(matched,matched2)

# Comparing those that had a clone entry to those that match the clone code format

# Those that match and have a direct clone entry 
setdiff(all_matched,erroneous_clone)
length(setdiff(all_matched,erroneous_clone)) # N = 18



clone_Ids <- df$Clone_CODE

# Matching ancestors after changing casing 
# Which parents match to cloneIDs
length(intersect(clone_Ids,parents)) # N = 134 

# Parents that dont have clone entries 
setdiff(parents,clone_Ids)

length(setdiff(parents,clone_Ids)) # N = 93


pattern <- "^\\d{6}([a-zA-Z]\\d?)?$|^\\d{7}([a-zA-Z]\\d?)?$"


matched <- grep(pattern, parents, value = TRUE)
length(matched)
setdiff(parents,matched)
length(setdiff(parents,matched)) # N=

## Checking if parental entries match 6 digit format 
pattern <- "^\\d{6}([a-zA-Z]\\d?)?$"
matched <- grep(pattern, parents, value = TRUE)
length(matched)
matched
length(setdiff(parents,matched))

length(setdiff(matched,clone_Ids))

original<-setdiff(matched,clone_Ids)
list<-setdiff(matched,clone_Ids)

list<- as.character(unlist(list))

# Adding "0" -- They now match clone_ids
list <- paste0("0",list)
length(setdiff(list,clone_Ids))
length(setdiff(list,parents))
length(intersect(list,parents))
length(intersect(list,clone_Ids))

# Changing these entries

df$Female_parent[df$Female_parent %in% original ] <- paste0("0", df$Female_parent[df$Female_parent %in% original])
df$Male_parent[df$Male_parent %in% original ] <- paste0("0", df$Male_parent[df$Male_parent %in% original])

parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)
clone_Ids <- df$Clone_CODE

pattern <- "^\\d{6}([a-zA-Z]\\d?)?$"
matched <- grep(pattern, parents, value = TRUE)
length(matched)
matched

setdiff(matched,clone_Ids) ## Checking they now match parents


### --------------------------------------------------------

# Manually Cleaning CLONE CODES


df$Clone_CODE <- gsub(" ", "", df$Clone_CODE)

df$Clone_CODE[df$Clone_CODE == "21016771677"] <- "2101677"
df$Clone_CODE[df$Clone_CODE == "21050925092"] <- "2105092"
df$Clone_CODE[df$Clone_CODE == "080003232"] <- "0800032"
df$Clone_CODE[df$Clone_CODE == "05077567756"] <- "0507756"
df$Clone_CODE[df$Clone_CODE == "0203441BB"] <- "0203441B"
df$Clone_CODE[df$Clone_CODE == "1824A"] <- "0001824A"
df$Clone_CODE[df$Clone_CODE == "9816269bB"] <- "9816269B"

parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)
clone_Ids <- df$Clone_CODE


setdiff(parents, clone_Ids)
length(setdiff(parents, clone_Ids)) # N = 83 That dont match between parents and clones
# Are in parents by not Clones


#### REFORMATTING CLONES WITH AN ADDITIONAL "/"

subset_2 <- df[grepl("^\\d{7}[a-zA-Z]/\\d+$", df$Clone_CODE), ]
nrow(subset_2)

clean_subset_2 <- subset_2
clean_subset_2$Clone_CODE <- gsub("/", "", clean_subset_2$Clone_CODE)

# Getting parallel row ids 
row_ids_2 <- rownames(clean_subset_2)
# Replacing in clean data frame 
df[row_ids_2, ] <-clean_subset_2

subset_2 <- df[grepl("^\\d{7}[a-zA-Z]/\\d+$", df$Clone_CODE), ]
nrow(subset_2) ## They have been removed 






##### ----- MANUALLY SEARCHING FOR CLONES -------
### Replacing parent entries with their equivalent clone entry (if possible)


pattern<- "1409998"

# Searching all the columns in the dataframe
df_char <- data.frame(lapply(df, as.character), stringsAsFactors = FALSE)
matched_rows <- apply(df_char, 1, function(row) any(grepl(pattern, row, ignore.case = TRUE)))
result_df <- df[matched_rows, ]
print(result_df)

df$Clone_CODE[df$Clone_CODE == "006205a"] <- "0006205a"

df$Female_parent[df$Female_parent == "0006205"] <- "0006205a"
df$Male_parent[df$Male_parent == "0006205"] <- "0006205a"
df$Female_parent[df$Female_parent == "6205"] <- "0006205a"
df$Male_parent[df$Male_parent == "6205"] <- "0006205a"

parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)
clone_Ids <- df$Clone_CODE

setdiff(parents, clone_Ids)
length(setdiff(parents, clone_Ids)) 

df$Female_parent[df$Female_parent == "9700940"] <- "9700940a"
df$Male_parent[df$Male_parent == "9700940"] <- "9700940a"


parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)
clone_Ids <- df$Clone_CODE

setdiff(parents, clone_Ids)
length(setdiff(parents, clone_Ids)) 


df$Female_parent[df$Female_parent == "0000014b"] <- "000014b"
df$Male_parent[df$Male_parent == "0000014b"] <- "000014b"

parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)
clone_Ids <- df$Clone_CODE

setdiff(parents, clone_Ids)
length(setdiff(parents, clone_Ids)) 


df$Female_parent[df$Female_parent == "0007156"] <- "007156"
df$Male_parent[df$Male_parent == "0007156"] <- "007156"
df$Male_parent[df$Male_parent == "7156"] <- "007156"
df$Female_parent[df$Female_parent == "7156"] <- "007156"

parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)
clone_Ids <- df$Clone_CODE

setdiff(parents, clone_Ids)
length(setdiff(parents, clone_Ids)) 


df$Female_parent[df$Female_parent == "929"] <- "000929a"
df$Male_parent[df$Male_parent == "929"] <- "000929a"


parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)
clone_Ids <- df$Clone_CODE

setdiff(parents, clone_Ids)
length(setdiff(parents, clone_Ids)) 

df$Female_parent[df$Female_parent == "0002444b"] <- "002444b"
df$Male_parent[df$Male_parent == "0002444b"] <- "002444b"

parents <-unique(c(df$Female_parent, df$Male_parent))
length(parents)
clone_Ids <- df$Clone_CODE


## Changing entry with parents '#' to match those of identified sibling 
## Only single entry present in this format
#Clone_CODE Female_parent F_G_Female F_G_Male Male_parent M_G_Female M_G_Male
#  32482   1409998a      9806490b        C12      TL1     9501336       <NA>     <NA>
#  32483   1409998b             #       <NA>     <NA>           #       <NA>     <NA>
df$Female_parent[df$Female_parent == "#"] <- "9806490b"
df$Male_parent[df$Male_parent == "#"] <- "9501336"


no_entry_parents<-setdiff(parents, clone_Ids)
length(setdiff(parents, clone_Ids)) 

## Currently only 74 parental plants that don't match clone_ids -- potential founders 

subset_ancestors <- df %>%
  filter(if_all(all_of(cols_to_check), is.na))


### Number of clone entries with not parents. - Potential founders (84)
length(subset_ancestors$Clone_CODE)
intersect(parents,subset_ancestors$Clone_CODE)


to_remove<-setdiff(subset_ancestors$Clone_CODE,parents) # Entries for founders that dont get used 
length(setdiff(subset_ancestors$Clone_CODE,parents)) # N = 81
#[1] "9615604"  "9811822"  "9723480b" "9723538b" "9804258b" "KB4P1"    "KB4P10"   "KB4P11"   "KB4P12"   "KB4P13"   "KB4P14"   "KB4P15"  
#[13] "KB4P16"   "KB4P17"   "KB4P18"   "KB4P19"   "KB4P2"    "KB4P20"   "KB4P21"   "KB4P22"   "KB4P23"   "KB4P24"   "KB4P25"   "KB4P26"  
#[25] "KB4P27"   "KB4P28"   "KB4P29"   "KB4P3"    "KB4P30"   "KB4P31"   "KB4P32"   "KB4P33"   "KB4P34"   "KB4P35"   "KB4P36"   "KB4P37"  
#[37] "KB4P38"   "KB4P39"   "KB4P4"    "KB4P40"   "KB4P41"   "KB4P42"   "KB4P43"   "KB4P44"   "KB4P45"   "KB4P46"   "KB4P47"   "KB4P48"  
#[49] "KB4P49"   "KB4P5"    "KB4P50"   "KB4P51"   "KB4P52"   "KB4P53"   "KB4P54"   "KB4P55"   "KB4P56"   "KB4P57"   "KB4P58"   "KB4P59"  
#[61] "KB4P6"    "KB4P60"   "KB4P61"   "KB4P62"   "KB4P63"   "KB4P64"   "KB4P65"   "KB4P66"   "KB4P67"   "KB4P68"   "KB4P69"   "KB4P7"   
#[73] "KB4P70"   "KB4P71"   "KB4P72"   "KB4P73"   "KB4P74"   "KB4P75"   "KB4P76"   "KB4P8"    "KB4P9"  


length(setdiff(clone_Ids,parents))# Number of clones never used for breeding N = 47725

length(setdiff(parents,clone_Ids))# Founders N = 74 (don't match clone_IDs)




## Checking for duplicate clone code entries
length(clone_Ids)
length(unique(clone_Ids))



###### REMOVE ANCESTORS THAT ARE NEVER USED


df <- df[!df$Clone_CODE %in% to_remove, ]
# Checking they have been removed
intersect(df$Clone_CODE, to_remove)


intersect(parents,clone_Ids)




## Checking for parents that start with 0 + 5 digits 
digit_clones <- df[grepl("^0\\d{5}([a-zA-Z])?$", df$Female_parent), ]
nrow(digit_clones)
unique(digit_clones$Female_parent)

digit_clones <- df[grepl("^0\\d{5}([a-zA-Z])?$", df$Male_parent), ]
nrow(digit_clones)
unique(digit_clones$Male_parent)



## Getting those that are years 01-09 that have lost an "0"
digit_clones_1to9_f <- df[grepl("^[1-8]\\d{5}([a-zA-Z])?$", df$Female_parent), ]
nrow(digit_clones_1to9_f)
unique(digit_clones_1to9_f$Female_parent)

digit_clones_1to9_m <- df[grepl("^[1-8]\\d{5}([a-zA-Z])?$", df$Male_parent), ]
nrow(digit_clones_1to9_m)
unique(digit_clones_1to9_m$Male_parent)


digit_clones <- df[grepl("^[9]\\d{5}([a-zA-Z])?$",df$Female_parent), ]
nrow(digit_clones)





## ************ Exploration ********


# ----------------  Analysing Twins -----------------

## Removal of twins - how many are left?

## ------ NUMBER OF TWINS - TWIN NO.2
matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",correct_df$correct_ID)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)


#### -------- TWIN NO.2 AS PARENTS
## Checking Twins ending in letter + "2" aren't used as parents 
matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",correct_df$)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$Male_parent)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)


matched_rows <- grepl("^\\d{7}([a-zA-Z/])2$",df$Female_parent)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)

## No No.2 twins used as parents -- they can be removed without consequence



## ------ NUMBER OF TWINS - TWIN NO.1
matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$Clone_CODE)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df) # N=170


#### -------- NO PARENTS ARE TWINS 
## Checking Twins ending in letter + "1" aren't used as parents 
matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$Male_parent)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$Male_parent)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)

matched_rows <- grepl("^\\d{7}([a-zA-Z/])1$",df$Female_parent)
# Get matching rows
matching_df <- df[matched_rows, ]
nrow(matching_df)

## No No.1 twins used as parents - 0



### Twins are not removed as they have no effect on breeding pedigree 
## kept for data integrity




#### CHECKING FOR PROPORTIONS OF SIBLINGS

male <- as.character(df$Male_parent)
female <- as.character(df$Female_parent)
# Combine both columns
all_parents <- c(male, female)


###------------------------ ALL
# Checking how many entries have parents that are clones with siblings 

pattern <- "^\\d{7}([a-zA-Z]|/)$"
# Matching 7digit followed by letter OR /

matches <- grepl(pattern, df$Male_parent) | grepl(pattern, df$Female_parent)
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

write.table(ranked_counts, file = "ranked_counts.txt", sep = "\t", row.names = FALSE, quote = FALSE)




###------------------------ A
# Checking how many entries have parents are clones - sibling a
pattern <- ("^\\d{7}[aA]\\d?$")

matches <- grepl(pattern, df$Male_parent) | grepl(pattern, df$Female_parent)
matching_df <- df[matches, ]
nrow(matching_df)
# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)


###------------------------ B
# Checking how many entries have parents are clones - sibling b
pattern <- ("^\\d{7}[bB]\\d?$")

matches <- grepl(pattern, df$Male_parent) | grepl(pattern, df$Female_parent)
matching_df <- df[matches, ]
nrow(matching_df)
# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)


###------------------------ C
# Checking how many entries have parents are clones - sibling c
pattern <- ("^\\d{7}[cC]\\d?$")

matches <- grepl(pattern, df$Male_parent) | grepl(pattern, df$Female_parent)
matching_df <- df[matches, ]
nrow(matching_df)
# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)


###------------------------ D
# Checking how many entries have parents are clones - sibling d
pattern <- ("^\\d{7}[dD]\\d?$")

matches <- grepl(pattern, df$Male_parent) | grepl(pattern, df$Female_parent)
matching_df <- df[matches, ]
nrow(matching_df)
# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)


###------------------------ E
# Checking how many entries have parents are clones - sibling e
pattern <- ("^\\d{7}[eE]\\d?$")

matches <- grepl(pattern, df$Male_parent) | grepl(pattern, df$Female_parent)
matching_df <- df[matches, ]
nrow(matching_df)

# Getting number of individual parents used 
matched_parents <- all_parents[grepl(pattern, all_parents)]
unique_matched_parents <- unique(matched_parents)
length(unique_matched_parents)


###------------------------ F
# Checking how many entries have parents are clones - sibling e
pattern <- ("^\\d{7}[fF]\\d?$")

matches <- grepl(pattern, df$Male_parent) | grepl(pattern, df$Female_parent)
matching_df <- df[matches, ]
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
  matches <- grepl(pattern, df$Male_parent) | grepl(pattern, df$Female_parent)
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

clones<- df$Clone_CODE
length(unique(clones))
all_parents<-unique(all_parents)
length(all_parents)


# Clones entries that match and are used as parents 
length(intersect(all_parents,clones))

founders<-setdiff(all_parents,clones)
length(setdiff(all_parents,clones))

length(setdiff(union(clones,all_parents), intersect(clones, all_parents)))


length(all_parents)
length(parents)

length(unique(c(df$Female_parent)))
length(unique(c(df$Male_parent)))
length(intersect(unique(c(df$Female_parent)),unique(c(df$Male_parent))))
length(setdiff(unique(c(df$Female_parent)),unique(c(df$Male_parent))))
length(setdiff(unique(c(df$Male_parent)),unique(c(df$Female_parent))))



### SYNBREED 


str(df)

sum(is.na(df))
sum(is.na(df$Clone_CODE))
sum(is.na(df$Female_parent))
sum(is.na(df$Male_parent))



sum(!complete.cases(df))
df[!complete.cases(df),]


## Finding and removing duplicates
## duplicated were first assessed as to impact for pedigree
## Where they used as parents?

# Only 1 duplicate , not used for breeding 
# removed first incidence 


all_dups <- duplicated(df$Clone_CODE)

# Find duplicated rows from the end (all except last occurrence)
dups_from_last <- duplicated(df$Clone_CODE, fromLast = TRUE)

# The "first duplicate" is the one that is duplicated from front but NOT duplicated from last
first_duplicates <- all_dups & !dups_from_last

# Remove those first duplicates
df<- df[!first_duplicates, ]


clean_df <-data.frame(
  ID = df$Clone_CODE,
  Female_parent = df$Female_parent,
  Male_parent = df$Male_parent
)


write.table(clean_df, "clean_pedigree_data.txt", 
            sep="\t", row.names = F, quote= F)



ped <- create.pedigree(
  ID=df$Clone,
  Par1=df$Female_parent,
  Par2=df$Male_parent,
  add.ancestors=T) # adding ancestors that dont occur in pedigree/ have no entry 



write.table(ped, "synbreed_pedigree.txt", 
            sep="\t", row.names = F, quote= F)


gp <- create.gpData(pedigree=ped)

png("synbreed_ped_vis.png", width = 800, height = 800)
plot(ped)
dev.off()
summary(gp)


# Generating Generation table 
table(ped$gener)

# Number of Ancestoral entries added 
nrow(ped) - nrow(df)

## Exploring pedigree


gen0<- ped[ped$gener == 0, ]
gen0_ID<-gen0$ID


setdiff(gen0_ID,clone_Ids)
setdiff(gen0_ID,parents)
intersect(gen0_ID,clone_Ids)




## Generation 1
gen1<- ped[ped$gener == 1, ]

# View them
print(gen1)

length(unique(gen1$ID))
first_two_digits <- substr(gen1$ID, 1, 2)
first_one_digits <- substr(gen1$ID, 1, 1)

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
print(gen2)

# Getting Number in generation
length(unique(gen2$ID))
# Selecting year prefix 
first_two_digits <- substr(gen2$ID, 1, 2)
first_one_digits <- substr(gen2$ID, 1,1)

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
print(gen3)

# Getting Number in generation
length(unique(gen3$ID))
# Selecting year prefix 
first_two_digits <- substr(gen3$ID, 1, 2)
first_one_digits <- substr(gen3$ID, 1,1)

unique_first_two_3 <- unique(first_two_digits)
unique_first_one_3 <- unique(first_one_digits)
print(unique_first_two_3)


# Your sets
set1 <- unique_first_two_1
set2 <- unique_first_two_2
set3 <- unique_first_two_3

# Open the PNG device
png("year_gen_venn.png", width = 800, height = 800)

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





# Running Kinship Matrix - SYNBREED


kinship.mx <- kin(gp)

write.csv(kinship.mx, file = "kinship_matrix.csv", row.names = TRUE)

write.table(kinship.mx, file = "kinship_matrix.txt", sep = "\t", quote = FALSE, row.names = TRUE, col.names = NA)




# Running Kinship Matrix - AGHmatrix

install.packages("AGHmatrix")
library(AGHmatrix)


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
write.csv(A_matrix, "A_matrix.csv")

write.table(A_matrix, "A_matrix.txt")









# Running Kinship Matrix - AGHmatrix
#install.packages("kinship2")
#library(kinship2)


#pedigree$sex <- 2
#pedigree$Par1[pedigree$Par1 == 0 | pedigree$Par1 == "0"] <- NA
#pedigree$Par2[pedigree$Par2 == 0 | pedigree$Par2 == "0"] <- NA
#pedigree[] <- lapply(pedigree, as.character)

#kin_mat <- kinship(pedigree)

# Convert to matrix
#kin_matrix <- as.matrix(kin_mat)

#kin_ped<-kinship2::pedigree(id = pedigree$ID, dadid= pedigree$Par1,momid=pedigree$Par2,sex=as.numeric(pedigree$sex))

### Unable to progress ---- dependent on sex





#library(nadiv)

#pedigree <- gp$pedigree

#ped <- data.frame(
#  ID = pedigree$ID,
#  dam = pedigree$Par1,
#  sire = pedigree$Par2
#)
# ped should be a data.frame with columns: id, sire, dam
#A <- makeA(ped)



