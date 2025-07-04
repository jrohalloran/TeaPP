
library(ggplot2)
library(scales)
library(openxlsx)
library(dplyr)
library(tibble)
library(tidyr)
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

# Parse JSON into a data frame
#df <- fromJSON(json_file)
df_long <- read.delim(input_file, header = TRUE, sep = "\t", stringsAsFactors = FALSE)

# View the data
#head(data)
# View the data as a proper data frame (datagram)
print(head(df_long))

df_long$date<-ymd(df_long$date)
df_long$rainfall <- as.numeric(df_long$rainfall)


file<- paste0(temp_dir,"/Month_Rain_lineplot.png")
# Open the PNG device

# LINE PLOT 
g<-ggplot(df_long, aes(x = date, y = rainfall)) +
  geom_line(color = "#0072B2", linewidth= 0.5) +
  scale_x_date(date_labels = "%Y", date_breaks = "1 year") +
  labs(
    title = "Monthly Rainfall Over Time",
    x = NULL,
    y = "Rainfall (mm)"
  ) +
  theme_minimal(base_size = 13) +
  theme(
    axis.text.x = element_text(angle = 90, hjust = 1),
    plot.title = element_text(face = "bold"),
    plot.subtitle = element_text(color = "gray40"),
    panel.grid.minor = element_blank()
  )+
    theme(plot.background = element_rect(fill = "white", color = NA),  # White background
        panel.background = element_rect(fill = "white", color = NA))

# Explicitly draw the grob to the device
ggsave(file, plot = g, width = 6, height = 4, dpi = 300)


file<- paste0(temp_dir,"/Seg_Year_Rain_lineplot.png")
# Open the PNG device

# SEGMENTED LINE PLOT 
df_long$month <- factor(df_long$month, levels = month.abb)
g<-ggplot(df_long, aes(x = month, y = rainfall, group = 1)) +
  geom_line(color = "#E69F00", linewidth = 1) +
  facet_wrap(~ year, ncol = 4) +
  labs(
    title = "Monthly Rainfall Patterns by Year",
    x = "Month", y = "Rainfall (mm)"
  ) +
  theme_minimal(base_size = 12) +
  theme(
    strip.text = element_text(face = "bold"),
    axis.text.x = element_text(angle = 45, hjust = 1),
    panel.spacing = unit(1, "lines"),
    plot.background = element_rect(fill = "white", color = NA),  # White background
    panel.background = element_rect(fill = "white", color = NA))
# Explicitly draw the grob to the device

ggsave(file, plot = g, width = 6, height = 4, dpi = 300)


file<- paste0(temp_dir,"/Rain_Heatmap.png")

# HEATMAP
g<-ggplot(df_long, aes(x = month, y = factor(year), fill = rainfall)) +
  geom_tile(color = "white", linewidth = 0.5) +
  scale_fill_viridis_c(option = "C", name = "Rainfall (mm)", direction = -1) +
  labs(
    title = "Monthly Rainfall Heatmap",
    x = "Month", y = "Year"
  ) +
  theme_minimal(base_size = 13) +
  theme(
    axis.text.x = element_text(angle = 45, hjust = 1),
    plot.title = element_text(face = "bold"),
    panel.grid = element_blank(),
    plot.background = element_rect(fill = "white", color = NA),  # White background
    panel.background = element_rect(fill = "white", color = NA))

ggsave(file, plot = g, width = 6, height = 4, dpi = 300)



df_cum <- df_long %>%
  group_by(year) %>%
  arrange(date) %>%
  mutate(cum_rainfall = cumsum(rainfall))



file<- paste0(temp_dir,"/Rain_boxplot.png")
# Open the PNG device


# BOXPLOT
g<-ggplot(df_long, aes(x = month, y = rainfall)) +
  geom_boxplot(fill = "#56B4E9", color = "#0072B2") +
  scale_x_discrete(limits = month.abb) +
  labs(title = "Distribution of Monthly Rainfall (All Years)",
       x = "Month", y = "Rainfall (mm)") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1),
  plot.background = element_rect(fill = "white", color = NA),  # White background
  panel.background = element_rect(fill = "white", color = NA))


ggsave(file, plot = g, width = 6, height = 4, dpi = 300)



file<- paste0(temp_dir,"/annual_Rain_boxplot_Hist.png")
# Open the PNG device

# Histogram/ Barplot - TOTAL ANNUAL RAINFALL
annual_rainfall <- df_long %>%
  group_by(year) %>%
  summarise(total_rainfall = sum(rainfall, na.rm = TRUE))

g<-ggplot(annual_rainfall, aes(x = factor(year), y = total_rainfall)) +
  geom_col(fill = "#D55E00") +
  labs(title = "Total Annual Rainfall",
       x = "Year", y = "Total Rainfall (mm)") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1),
  plot.background = element_rect(fill = "white", color = NA),  # White background
  panel.background = element_rect(fill = "white", color = NA))


ggsave(file, plot = g, width = 6, height = 4, dpi = 300)



# SEASONAL RAINFAILL - BOXPLOT 
df_long <- df_long %>%
  mutate(season = case_when(
    month %in% c("Dec", "Jan", "Feb") ~ "Winter",
    month %in% c("Mar", "Apr", "May") ~ "Spring",
    month %in% c("Jun", "Jul", "Aug") ~ "Summer",
    month %in% c("Sep", "Oct", "Nov") ~ "Fall"
  ))

file<- paste0(temp_dir,"/seasonal_rainfall.png")
# Open the PNG device

g<-ggplot(df_long, aes(x = season, y = rainfall)) +
  geom_boxplot(fill = "#009E73") +
  labs(title = "Seasonal Rainfall Distribution",
       x = "Season", y = "Rainfall (mm)") +
  theme_minimal()+
  theme(plot.background = element_rect(fill = "white", color = NA),  # White background
  panel.background = element_rect(fill = "white", color = NA))

ggsave(file, plot = g, width = 6, height = 4, dpi = 300)



file<- paste0(temp_dir,"/layered_all_rainfall.png")
# Open the PNG device

# OVERLAPPING LINE GRAPH PER YEAR

df_long <- df_long %>%
  mutate(month = factor(month, levels = month.abb))

g<-ggplot(df_long, aes(x = month, y = rainfall, group = factor(year), color = factor(year))) +
  geom_line(alpha = 0.7, linewidth = 1) +
  labs(
    title = "Monthly Rainfall Patterns Over Years",
    x = "Month",
    y = "Rainfall (mm)",
    color = "Year"
  ) +
  theme_minimal(base_size = 14) +
  theme(
    axis.text.x = element_text(angle = 45, hjust = 1),
    legend.position = "right",
    plot.background = element_rect(fill = "white", color = NA),  # White background
    panel.background = element_rect(fill = "white", color = NA))

ggsave(file, plot = g, width = 6, height = 6, dpi = 300)


