
### Jennifer O'Halloran

## Manual Cleaning and Processing Script 
## IBIX Thesis Project July/August 2025


library(synbreed)
library(openxlsx)
library(dplyr)



setwd("~/Documents/Cranfield/Thesis/Data_Resources")
data <- read.xlsx("HPT_Clones_Edited.xlsx", sheet = 1)

df <- data%>%filter(!is.na(Clone_CODE))





# Converting to characters 
df$Clone_CODE <- as.character(df$Clone_CODE)
df$Female_parent <- as.character(df$Female_parent)
df$Male_parent <- as.character(df$Male_parent)



# Stats before processing 
length(unique(c(df$Female_parent,df$Male_parent)))
length(unique(c(df$Female_parent))) # Females before 
length(unique(c(df$Male_parent))) # Males before 
length(intersect(unique(c(df$Female_parent)),unique(c(df$Male_parent))))

length(setdiff(unique(c(df$Female_parent)),unique(c(df$Male_parent))))
length(setdiff(unique(c(df$Male_parent)),unique(c(df$Female_parent))))

parents<-unique(c(df$Female_parent,df$Male_parent))
length(parents)
length(intersect(parents,df$Clone_CODE)) # Match parental records

offspring<-unique(df$Clone_CODE)

length(setdiff(offspring, parents)) # Are offspring but not used as parents
length(setdiff(parents, offspring)) # Are parents that are not recorded offspring (founders?)

length(intersect(parents, offspring)) # Are parents with offspring record (match)

nonmatch_parents<-setdiff(parents, offspring)
length(setdiff(parents, offspring))




# Converting to Uppercase 
df$Clone_CODE <- toupper(df$Clone_CODE)
df$Female_parent <- toupper(df$Female_parent)
df$Male_parent <- toupper(df$Male_parent)

# Removing Whitespace
df$Clone_CODE<- gsub("\\s+", "", df$Clone_CODE)
df$Female_parent<- gsub("\\s+", "", df$Female_parent)
df$Male_parent<- gsub("\\s+", "", df$Male_parent)

# Number of raw entries - clones before cleaning 
nrow(df)


correct_df<- data.frame(
  ID = df$Clone_CODE,
  Female_parent = df$Female_parent,
  Male_parent = df$Male_parent,
  correct_ID = df$Clone_CODE,
  correct_Female = df$Female_parent,
  correct_Male = df$Male_parent
)


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


has_whitespace <- apply(correct_df[cols_to_check], 1, function(row) {
  any(grepl("\\S\\s+\\S", row))
})
rows_with_whitespace <- correct_df[has_whitespace, ]

cols_to_check <- c("Female_parent", "Male_parent")
has_whitespace <- apply(correct_df[cols_to_check], 1, function(row) {
  any(grepl("\\S\\s+\\S", row))
})
rows_with_whitespace <- correct_df[has_whitespace, ]


cols_to_check <- c("Female_parent", "Male_parent")  # <-- original columns
has_whitespace <- apply(correct_df[cols_to_check], 1, function(row) {
  any(grepl("\\S\\s+\\S", row))
})





## Using regex to match against known nomeclature

message("Processing Clone IDs....")

# Checking for valid IDs
valid_clones_7 <- df[grepl("^\\d{7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones_7)

valid_clones_6 <- df[grepl("^\\d{6}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones_6)


valid_clones <- df[grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(valid_clones)

# Checking for Invalid IDs
invalid_clones <- df[!grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(invalid_clones)

invalid_clones_7 <- df[!grepl("^\\d{7}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(invalid_clones_7)


invalid_clones <- df[!grepl("^\\d{6}([a-zA-Z]\\d?)?$", df$Clone_CODE), ]
nrow(invalid_clones)








## Getting ID that have a missing 0 (0+ 5 digits)
digit_clones <- df[grepl("^0\\d{5}([a-zA-Z])?$", df$Clone_CODE), ]
nrow(digit_clones)

digit_clones_1to9 <- df[grepl("^[1-8]\\d{5}([a-zA-Z])?$", df$Clone_CODE), ]
nrow(digit_clones_1to9)



### Updating these in correct_df  -- Add 0 
pattern <- "^0\\d{5}([a-zA-Z])?$"
matching_rows <- grepl(pattern, correct_df$correct_ID)
correct_df$correct_ID[matching_rows] <- paste0("0", correct_df$correct_ID[matching_rows])


digit_clones <- correct_df[grepl("^0\\d{5}([a-zA-Z])?$",correct_df$ID), ]
nrow(digit_clones)
digit_clones <- correct_df[grepl("^0\\d{5}([a-zA-Z])?$",correct_df$correct_ID), ]
nrow(digit_clones)

pattern <- "^[1-8]\\d{5}([a-zA-Z])?$"
matching_rows <- grepl(pattern, correct_df$correct_ID)
correct_df$correct_ID[matching_rows] <- paste0("0", correct_df$correct_ID[matching_rows])

digit_clones <- correct_df[grepl("^[1-8]\\d{5}([a-zA-Z])?$",correct_df$ID), ]
nrow(digit_clones)
digit_clones <- correct_df[grepl("^[1-8]\\d{5}([a-zA-Z])?$",correct_df$correct_ID), ]
nrow(digit_clones)




## Getting row with additional / 

clone_with_slash <- df[grepl("^\\d{7}[a-zA-Z]/\\d+$", df$Clone_CODE), ]
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


valid_clones <- correct_df[grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", correct_df$correct_ID), ]
nrow(valid_clones)


invalid_clones <- correct_df[!grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", correct_df$correct_ID), ]
nrow(invalid_clones)




# Manually updating parents

sum(grepl("YAB JAT4", df$Male_parent))
sum(grepl("YAB JAT4", df$Female_parent))
sum(grepl("YAB_JAT4", df$Male_parent))
sum(grepl("YAB_JAT4", df$Female_parent))
sum(grepl("YAB_JAT4", correct_df$Male_parent))
sum(grepl("YAB_JAT4", correct_df$Female_parent))
sum(grepl("YAB JAT4", correct_df$Male_parent))
sum(grepl("YAB JAT4", correct_df$Female_parent))


correct_df$Male_parent <- gsub("YAB JAT4", "YAB_JAT4", correct_df$Male_parent)
correct_df$Female_parent <- gsub("YAB JAT4", "YAB_JAT4", correct_df$Female_parent)

sum(grepl("YAB_JAT4", correct_df$Male_parent))
sum(grepl("YAB_JAT4", correct_df$Female_parent))
sum(grepl("YAB_JAT4", df$Female_parent))
sum(grepl("YAB_JAT4", df$Male_parent))

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
length(unique(c(correct_df$Female_parent)))
length(unique(c(correct_df$Male_parent)))
length(intersect(unique(c(correct_df$Female_parent)),unique(c(correct_df$Male_parent))))
length(setdiff(unique(c(correct_df$Female_parent)),unique(c(correct_df$Male_parent))))
length(setdiff(unique(c(correct_df$Male_parent)),unique(c(correct_df$Female_parent))))



# Manually identifying and upating erroneous clone IDs

correct_df$correct_ID[correct_df$correct_ID == "21016771677"] <- "2101677"
sum(grepl("21016771677", df$Clone_CODE))
sum(grepl("21016771677", correct_df$correct_ID))

correct_df$correct_ID[correct_df$correct_ID == "21050925092"] <- "2105092"
sum(grepl("21050925092", df$Clone_CODE))
sum(grepl("21050925092", correct_df$correct_ID))

correct_df$correct_ID[correct_df$correct_ID == "080003232"] <- "0800032"
sum(grepl("080003232", df$Clone_CODE))
sum(grepl("080003232", correct_df$correct_ID))

correct_df$correct_ID[correct_df$correct_ID == "05077567756"] <- "0507756"
sum(grepl("05077567756", df$Clone_CODE))
sum(grepl("05077567756", correct_df$correct_ID))

correct_df$correct_ID[correct_df$correct_ID == "0203441BB"] <- "0203441B"
sum(grepl("05077567756", df$Clone_CODE))
sum(grepl("05077567756", correct_df$correct_ID))

correct_df$correct_ID[correct_df$correct_ID == "1824A"] <- "0001824A"
sum(grepl("1824A", df$Clone_CODE))
sum(grepl("1824A",correct_df$correct_ID))

correct_df$correct_ID[correct_df$correct_ID  == "9816269BB"] <- "9816269B"
sum(grepl("9816269BB", df$Clone_CODE))
sum(grepl("9816269BB", correct_df$correct_ID))



parents <-unique(c(correct_df$Female_parent, correct_df$Male_parent))
length(parents)



# Further Manual Cleaning of Parents

pattern<- "9707707B"

# Searching all the columns in the dataframe
df_char <- data.frame(lapply(df, as.character), stringsAsFactors = FALSE)
matched_rows <- apply(df_char, 1, function(row) any(grepl(pattern, row, ignore.case = TRUE)))
result_df <- correct_df[matched_rows, ]
print(result_df)


df$Clone_CODE[df$Clone_CODE == "006205a"] <- "0006205A"

correct_df$Female_parent[correct_df$Female_parent == "0006205"] <- "0006205A"
correct_df$Male_parent[correct_df$Male_parent == "0006205"] <- "0006205A"
correct_df$Female_parent[correct_df$Female_parent == "6205"] <- "0006205A"
correct_df$Male_parent[correct_df$Male_parent == "6205"] <- "0006205A"

correct_df$correct_Female[correct_df$correct_Female == "0006205"] <- "0006205A"
correct_df$correct_Male[correct_df$correct_Male == "0006205"] <- "0006205A"
correct_df$correct_Female[correct_df$correct_Female == "6205"] <- "0006205A"
correct_df$correct_Male[correct_df$correct_Male == "6205"] <- "0006205A"

parents <-unique(c(correct_df$Female_parent, correct_df$Male_parent))
length(parents)



correct_df$Female_parent[correct_df$Female_parent == "9700940"] <- "9700940A"
correct_df$Male_parent[correct_df$Male_parent == "9700940"] <- "9700940A"

correct_df$correct_Female[correct_df$correct_Female == "9700940"] <- "9700940A"
correct_df$correct_Male[correct_df$correct_Male== "9700940"] <- "9700940A"


correct_df$Female_parent[correct_df$Female_parent  == "000014B"] <-"0000014B"
correct_df$Male_parent[correct_df$Male_parent  == "000014B"] <-"0000014B"

correct_df$correct_Female[correct_df$correct_Female  == "000014B"] <-"0000014B"
correct_df$correct_Male[correct_df$correct_Male  == "000014B"] <-"0000014B"




correct_df$Female_parent[correct_df$Female_parent == "7156"] <- "0007156"
correct_df$Male_parent[correct_df$Male_parent == "7156"] <- "0007156"

correct_df$correct_Female[correct_df$correct_Female   == "7156"] <- "0007156"
correct_df$correct_Male[correct_df$correct_Male   == "7156"] <- "0007156"



correct_df$Female_parent[correct_df$Female_parent == "929"] <- "0000929A"
correct_df$Male_parent[correct_df$Male_parent == "929"] <- "0000929A"


correct_df$correct_Female[correct_df$correct_Female  == "929"] <- "0000929A"
correct_df$correct_Male[correct_df$correct_Male == "929"] <- "0000929A"


parents <-unique(c(correct_df$Female_parent, correct_df$Male_parent))
length(parents)

clone_Ids <- correct_df$correct_ID



correct_df$Female_parent[correct_df$Female_parent == "#"] <- "9806490B"
correct_df$Male_parent[correct_df$Male_parent == "#"] <- "9501336"

correct_df$correct_Female[correct_df$correct_Female  == "#"] <- "9806490B"
correct_df$correct_Male[correct_df$correct_Male == "#"] <- "9501336"



correct_df$Female_parent[correct_df$Female_parent == "605906"] <- "0605906"
correct_df$Male_parent[correct_df$Male_parent == "605906"] <- "0605906"

correct_df$correct_Female[correct_df$correct_Female  == "605906"] <- "0605906"
correct_df$correct_Male[correct_df$correct_Male == "605906"] <- "0605906"



correct_df$Female_parent[correct_df$Female_parent == "864"] <- "0000864"
correct_df$Male_parent[correct_df$Male_parent == "864"] <- "0000864"

correct_df$correct_Female[correct_df$correct_Female  == "864"] <- "0000864"
correct_df$correct_Male[correct_df$correct_Male == "864"] <- "0000864"




# Finding parents that dont match IDs
nonmatch_parents<-setdiff(parents, clone_Ids)
length(setdiff(parents, clone_Ids))


# Checking for Invalid IDs parental


invalid_clones <- correct_df[grepl("^\\d{6}([a-zA-Z]\\d?)?$", correct_df$correct_Female), ]
nrow(invalid_clones)

### FEMALE PARENTS
## Getting ID that have a missing 0 (0+ 5 digits)
digit_clones <-  correct_df[grepl("^0\\d{5}([a-zA-Z])?$", correct_df$correct_Female), ]
nrow(digit_clones)

digit_clones_1to9 <-  correct_df[grepl("^[1-8]\\d{5}([a-zA-Z])?$", correct_df$correct_Female), ]
nrow(digit_clones_1to9)
ids_1to9<-digit_clones_1to9$correct_Female
unique(ids_1to9)

### Updating these in correct_df  -- Add 0 
pattern <- "^0\\d{5}([a-zA-Z])?$"
matching_rows <- grepl(pattern, correct_df$correct_Female)
correct_df$correct_Female[matching_rows] <- paste0("0", correct_df$correct_Female[matching_rows])


digit_clones <- correct_df[grepl("^0\\d{5}([a-zA-Z])?$",correct_df$correct_Female), ]
nrow(digit_clones)
digit_clones <- correct_df[grepl("^0\\d{5}([a-zA-Z])?$",correct_df$correct_Female), ]
nrow(digit_clones)

pattern <- "^[1-8]\\d{5}([a-zA-Z])?$"
matching_rows <- grepl(pattern, correct_df$correct_Female)
correct_df$correct_Female[matching_rows] <- paste0("0", correct_df$correct_Female[matching_rows])

digit_clones <- correct_df[grepl("^[1-8]\\d{5}([a-zA-Z])?$",correct_df$correct_Female), ]
nrow(digit_clones)
digit_clones <- correct_df[grepl("^[1-8]\\d{5}([a-zA-Z])?$",correct_df$correct_Female), ]
nrow(digit_clones)

### MALE PARENTS
digit_clones <-  correct_df[grepl("^0\\d{5}([a-zA-Z])?$", correct_df$correct_Male), ]
nrow(digit_clones)

digit_clones_1to9 <-  correct_df[grepl("^[1-8]\\d{5}([a-zA-Z])?$", correct_df$correct_Male), ]
nrow(digit_clones_1to9)
ids_1to9<-digit_clones_1to9$correct_Male
unique(ids_1to9)


### Updating these in correct_df  -- Add 0 
pattern <- "^0\\d{5}([a-zA-Z])?$"
matching_rows <- grepl(pattern, correct_df$correct_Male)
correct_df$correct_Male[matching_rows] <- paste0("0", correct_df$correct_Male[matching_rows])


digit_clones <- correct_df[grepl("^0\\d{5}([a-zA-Z])?$",correct_df$correct_Male), ]
nrow(digit_clones)
digit_clones <- correct_df[grepl("^0\\d{5}([a-zA-Z])?$",correct_df$correct_Male), ]
nrow(digit_clones)

pattern <- "^[1-8]\\d{5}([a-zA-Z])?$"
matching_rows <- grepl(pattern, correct_df$correct_Male)
correct_df$correct_Male[matching_rows] <- paste0("0", correct_df$correct_Male[matching_rows])

digit_clones <- correct_df[grepl("^[1-8]\\d{5}([a-zA-Z])?$",correct_df$correct_Male), ]
nrow(digit_clones)
digit_clones <- correct_df[grepl("^[1-8]\\d{5}([a-zA-Z])?$",correct_df$correct_Male), ]
nrow(digit_clones)



# Checking Parents

digit_clones <- df[grepl("^0\\d{5}([a-zA-Z])?$", correct_df$Female_parent), ]
nrow(digit_clones)

digit_clones <- df[grepl("^0\\d{5}([a-zA-Z])?$", correct_df$Male_parent), ]
nrow(digit_clones)




### Checking for 09 Entries

digit_clones <- correct_df[grepl("^[9]\\d{5}([a-zA-Z])?$",correct_df$Female_parent), ]
nrow(digit_clones)

pattern <- "^[9]\\d{5}([a-zA-Z])?$"
matching_rows <- grepl(pattern, correct_df$Female_parent)
correct_df$correct_Female[matching_rows] <- paste0("0", correct_df$Female_parent[matching_rows])

digit_clones <- correct_df[grepl("^[9]\\d{5}([a-zA-Z])?$",correct_df$Female_parent), ]
nrow(digit_clones)

digit_clones <- correct_df[grepl("^[9]\\d{5}([a-zA-Z])?$",correct_df$Male_parent), ]
nrow(digit_clones)
unique(digit_clones$Male_parent)

pattern <- "^[9]\\d{5}([a-zA-Z])?$"
matching_rows <- grepl(pattern, correct_df$Male_parent)
correct_df$correct_Male[matching_rows] <- paste0("0", correct_df$Male_parent[matching_rows])

digit_clones <- correct_df[grepl("^[9]\\d{5}([a-zA-Z])?$",correct_df$correct_Male), ]
nrow(digit_clones)
unique(digit_clones$correct_Male)



parents <-unique(c(correct_df$correct_Female, correct_df$correct_Male))
length(parents)
clone_Ids <- correct_df$correct_ID

nonmatch_parents<-setdiff(parents, clone_Ids)
length(setdiff(parents, clone_Ids))



# Removing NA
nonmatch_parents <- nonmatch_parents[!is.na(nonmatch_parents)]
# Number of parents that don't match an offspring record (founder or invalid)
length(nonmatch_parents)


## Number of unique parents:
parents<- unique(parents)

parents <- parents [!is.na(parents) & trimws(parents) != ""]
length(parents)

length(intersect(parents, correct_df$correct_ID))


length(unique(c(correct_df$correct_Female)))
unique_fem<-unique(c(correct_df$correct_Female))
unique_fem <- unique_fem[!is.na(unique_fem) & trimws(unique_fem) != ""]
length(unique_fem)

length(unique(c(correct_df$correct_Male)))
unique_male<-unique(c(correct_df$correct_Male))
unique_male <- unique_male[!is.na(unique_male) & trimws(unique_male) != ""]
length(unique_male)


intersect<-(intersect(unique(c(correct_df$correct_Male)),unique(c(correct_df$correct_Female))))
intersect <- intersect[!is.na(intersect) & trimws(intersect) != ""]
length(intersect)

intersect<-setdiff(unique(c(correct_df$correct_Male)),unique(c(correct_df$correct_Female)))
intersect <- intersect[!is.na(intersect) & trimws(intersect) != ""]
length(intersect)

set_diff<-setdiff(unique(c(correct_df$correct_Female)),unique(c(correct_df$correct_Male)))
set_diff <- set_diff[!is.na(set_diff) & trimws(set_diff) != ""]
length(set_diff)




cols_to_check <- c("Female_parent", "Male_parent")


# Finding entries without parental records 
rows_with_na <- correct_df[ rowSums(is.na(correct_df[cols_to_check])) > 0, ]

# Getting their IDs

na_clones<-rows_with_na$correct_ID

# Finding those not used as parents (are not active founders) n = 81
length(setdiff(na_clones,parents)) 


# Removing them 
to_remove<-(setdiff(na_clones,parents))
correct_df <- correct_df[!correct_df$correct_ID%in% to_remove, ]



# Checking for duplicates 

message("Checking for duplicates....")
unique(correct_df$correct_ID[duplicated(correct_df$correct_ID)])

correct_df[duplicated(correct_df$correct_ID) | duplicated(correct_df$correct_ID, fromLast = TRUE), ]

## Removing Duplicates
correct_df <- correct_df[!duplicated(correct_df$correct_ID), ]





valid_clones_7 <- correct_df[grepl("^\\d{7}([a-zA-Z]\\d?)?$", correct_df$correct_ID), ]
nrow(valid_clones_7)

valid_clones_6 <- correct_df[grepl("^\\d{6}([a-zA-Z]\\d?)?$", correct_df$correct_ID), ]
nrow(valid_clones_6)

valid_clones <- correct_df[grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", correct_df$correct_ID), ]
nrow(valid_clones)


invalid_clones <- correct_df[!grepl("^\\d{6,7}([a-zA-Z]\\d?)?$", correct_df$correct_ID), ]
nrow(invalid_clones)


invalid_clones$correct_ID


nrow(correct_df)




clean_df <-data.frame(
  ID = correct_df$correct_ID,
  Female_parent = correct_df$correct_Female,
  Male_parent = correct_df$correct_Male
)


write.table(clean_df, "clean_pedigree_2.txt", 
            sep="\t", row.names = F, quote= F)





ped <- create.pedigree(
  ID=(as.character(correct_df$correct_ID)),
  Par1=(as.character(correct_df$correct_Female)),
  Par2=(as.character(correct_df$correct_Male)),
  add.ancestors=T) # adding ancestors that dont occur in pedigree/ have no entry 


gp <- create.gpData(pedigree=ped)

table(ped$gener)

df$Clone_CODE <- as.character(df$Clone_CODE)
df$Female_parent <- as.character(df$Female_parent)
df$Male_parent <- as.character(df$Male_parent)

gen0<- ped[ped$gener == 0, ]
gen0_ID<-gen0$ID
gen0_ID

# Comparing to Synbreed Generation Results
setdiff(gen0_ID,clone_Ids) # Gen 0 that are not in clone IDs
length(setdiff(gen0_ID,clone_Ids))# n = 72

setdiff(gen0_ID,parents) # Gen 0 that are not in parental records
intersect(gen0_ID,clone_Ids) # Those that are in both Geno 0 and Clone IDs (n=3)
length(unique(intersect(gen0_ID,parents)))
length(setdiff(gen0_ID,clone_Ids))
length(setdiff(clone_Ids,gen0_ID))

length(setdiff(parents,gen0_ID))

setdiff(gen0_ID,nonmatch_parents)
setdiff(nonmatch_parents,gen0_ID)



valid_clones_7 <- grep("^\\d{7}([a-zA-Z]\\d?)?$", gen0_ID)
length(unique(valid_clones_7))

gen0_ID
