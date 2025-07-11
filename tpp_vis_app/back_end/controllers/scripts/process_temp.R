
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
library(plotly)
library(htmlwidgets)
library(pandoc)


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


df_long <- read.delim(input_file, header = TRUE, sep = "\t", stringsAsFactors = FALSE)

df_long$year <- as.factor(df_long$year)
df_long$month<- as.factor(df_long$month)


## FACETED LINE PLOT

file<- paste0(temp_dir,"/temperature_year_month.png")

g<-ggplot(df_long, aes(x = month, y = value, color = stat, group = stat)) +
  geom_line() +
  facet_wrap(~year) +
  labs(title = "Monthly Temperature by Year",
       x = "Month", y = "Temperature (°C)") +
  theme_minimal()+
  theme(
    axis.text.x = element_text(angle = 90, hjust = 1,size=5),
    panel.spacing = unit(0.5, "lines"),
    plot.background = element_rect(fill = "white", color = NA),  # White background
    panel.background = element_rect(fill = "white", color = NA))

ggsave(file, plot = g, width = 6, height = 6, dpi = 300)

file<- paste0(temp_dir,"/temperature_year_month.html")
g_plotly <- ggplotly(g)
# Save as standalone HTML
saveWidget(g_plotly, file, selfcontained = FALSE)



## LAYERED LINE PLOT

file<- paste0(temp_dir,"/temperature_year_layered.png")

g<-ggplot(df_long, aes(x = month, y = value, group = interaction(year, stat), color = year)) +
  geom_line(alpha = 0.5) +
  labs(title = "Mean, Min, and Max Temperatures Across All Years",
       x = "Month", y = "Temperature (°C)", color = "Statistic") +
        theme(plot.background = element_rect(fill = "white", color = NA),  # White background
        panel.background = element_rect(fill = "white", color = NA))


ggsave(file, plot = g, width = 6, height = 6, dpi = 300)

file<- paste0(temp_dir,"/temperature_year_layered.html")
g_plotly <- ggplotly(g)
# Save as standalone HTML
saveWidget(g_plotly, file, selfcontained = FALSE)



# BOX PLOT by year 

file<- paste0(temp_dir,"/temperature_boxplot_year.png")
g<-ggplot(df_long, aes(x = stat, y = value, fill = as.factor(year))) +
  geom_boxplot(position = position_dodge(width = 0.8)) +
  labs(
    title = "Monthly Temperature Summary by Statistic and Year",
    x = "Statistic",
    y = "Temperature (°C)",
    fill = "Year"
  ) +
  theme(plot.background = element_rect(fill = "white", color = NA),  # White background
        panel.background = element_rect(fill = "white", color = NA))

ggsave(file, plot = g, width = 6, height = 6, dpi = 300)

file<- paste0(temp_dir,"/temperature_boxplot_year.html")
g_plotly <- ggplotly(g)
# Save as standalone HTML
saveWidget(g_plotly, file, selfcontained = FALSE)


print(head(df_long))

mean_df <- subset(df_long, stat == "MEAN")
min_df<-subset(df_long, stat == "MINIMUM")
max_df<-subset(df_long, stat == "MAXIMUM")

## MEAN


file<- paste0(temp_dir,"/temperature_boxplot_MEAN.png")
g<-ggplot(mean_df, aes(x = year, y = value)) +
  geom_boxplot(fill = "pink", position = position_dodge(width = 0.8)) +
  labs(
    title = "Monthly MEAN Temperature Summary by Year",
    x = "Year",
    y = "Temperature (°C)"
  ) +
  theme_minimal() +
  theme(legend.position = "none",plot.background = element_rect(fill = "white", color = NA),  # White background
        panel.background = element_rect(fill = "white", color = NA))
ggsave(file, plot = g, width = 6, height = 6, dpi = 300)

file<- paste0(temp_dir,"/temperature_boxplot_MEAN.html")
g_plotly <- ggplotly(g)
# Save as standalone HTML
saveWidget(g_plotly, file, selfcontained = FALSE)


## MINIMUM
file<- paste0(temp_dir,"/temperature_boxplot_MIN.png")
g<-ggplot(min_df, aes(x = year, y =value)) +
  geom_boxplot(fill="skyblue",position = position_dodge(width = 0.8)) +
  labs(
    title = "Monthly MINIMUM Temperature Summary by Year",
    x = "Year",
    y = "Temperature (°C)",
    fill = "Year"
  ) +
  theme_minimal()+
  theme(legend.position = "none",plot.background = element_rect(fill = "white", color = NA),  # White background
        panel.background = element_rect(fill = "white", color = NA))
ggsave(file, plot = g, width = 6, height = 6, dpi = 300)

file<- paste0(temp_dir,"/temperature_boxplot_MIN.html")
g_plotly <- ggplotly(g)
# Save as standalone HTML
saveWidget(g_plotly, file, selfcontained = FALSE)



## MAXIMUM
file<- paste0(temp_dir,"/temperature_boxplot_MAX.png")
g<-ggplot(max_df, aes(x = year, y =value)) +
  geom_boxplot(fill = "lightgreen",position = position_dodge(width = 0.8)) +
  labs(
    title = "Monthly MAXIMUM Temperature Summary by Year",
    x = "Year",
    y = "Temperature (°C)",
    fill = "Year"
  ) +
  theme_minimal()+
  theme(legend.position = "none",plot.background = element_rect(fill = "white", color = NA),  # White background
        panel.background = element_rect(fill = "white", color = NA))
ggsave(file, plot = g, width = 6, height = 6, dpi = 300)

file<- paste0(temp_dir,"/temperature_boxplot_MAX.html")
g_plotly <- ggplotly(g)
# Save as standalone HTML
saveWidget(g_plotly, file, selfcontained = FALSE)
