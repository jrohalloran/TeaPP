
## Jennifer O'Halloran

## 09/07/25

## Thesis Project: TeaPP Visualisation App Prototype 

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from skimage.measure import block_reduce
import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder

from sklearn.decomposition import PCA
from sklearn.manifold import MDS
import os

import plotly.express as px

chunk_size = 1000  # rows per chunk
matrix_chunks = []
row_labels = []

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir) # Scripts
temp_dir = os.path.join(parent_dir,"temp")
GENERATION_FILE = os.path.join(temp_dir, "pedigree.txt")


npy_file = os.path.join(temp_dir,"kinship_matrix.npy")
txt_file = os.path.join(temp_dir,"kinship_matrix.txt")

if os.path.exists(npy_file):
    print(f"Loading matrix from {npy_file}...")
    K = np.load(npy_file)
else:
    print("Reading kinship.txt and assembling matrix...")
    with open(txt_file) as f:
        header = f.readline().strip().split()[1:]
        print(f"Header loaded with {len(header)} columns")

        chunk_count = 0
        total_rows = 0

        while True:
            lines = [f.readline() for _ in range(chunk_size)]
            lines = [line for line in lines if line]

            if not lines:
                print("Reached end of file.")
                break

            chunk = []
            for line in lines:
                parts = line.strip().split()
                row_labels.append(parts[0])
                row_data = [float(x) for x in parts[1:]]
                chunk.append(row_data)

            matrix_chunks.append(np.array(chunk))
            chunk_count += 1
            total_rows += len(chunk)

            print(f"Loaded chunk {chunk_count}: {len(chunk)} rows, total rows so far: {total_rows}")

    K = np.vstack(matrix_chunks)
    K = K.astype(np.float32)

    print(f"Total matrix shape: {K.shape}")
    np.save(npy_file, K)
   ## print(f"Saving matrix to {npy_file}...")

# Downsample matrix (adjust block_size as needed)
block_size = (100, 100)
K_small = block_reduce(K, block_size=block_size, func=np.nanmean)

print(f"Downsampled matrix shape: {K_small.shape}")


OUTDIR = os.path.join(parent_dir, "kinship_plots")
os.makedirs(OUTDIR, exist_ok=True)

#1. Heatmap of downsampled matrix
plt.figure(figsize=(10, 8))
sns.heatmap(K_small, cmap="viridis")
plt.title(f"Downsampled Kinship Matrix (block size={block_size})")
plt.savefig(f"{OUTDIR}/kinship_heatmap.png", dpi=300)
plt.close()


fig = px.imshow(
    K_small,
    color_continuous_scale="viridis",
    title=f"Downsampled Kinship Matrix (block size={block_size})",
    aspect="auto"
)
fig.update_layout(margin=dict(l=40, r=40, t=60, b=40))
fig.write_html(f"{OUTDIR}/kinship_heatmap.html")
#fig.show()

# 2. Histogram of kinship values
plt.figure(figsize=(8,5))
plt.hist(K.flatten(), bins=100, color='skyblue', edgecolor='black')
plt.title("Histogram of Kinship Values")
plt.xlabel("Kinship")
plt.ylabel("Frequency")
plt.savefig(f"{OUTDIR}/kinship_histogram.png", dpi=300)
plt.close()

fig = px.histogram(
    K.flatten(),
    nbins=100,
    title="Histogram of Kinship Values",
    labels={'value': 'Kinship'},
    color_discrete_sequence=['skyblue']
)
fig.update_traces(marker_line_color="black", marker_line_width=1)
fig.update_layout(xaxis_title="Kinship", yaxis_title="Frequency")
fig.write_html(f"{OUTDIR}/kinship_histogram.html")
#fig.show()


# 3. Clustered heatmap
sns.clustermap(K_small, cmap="viridis", figsize=(12, 12))
plt.suptitle("Clustered Kinship Heatmap")
plt.savefig(f"{OUTDIR}/kinship_clustermap.png", dpi=300)
plt.close()


from scipy.cluster.hierarchy import linkage, leaves_list

# Cluster rows and columns
row_linkage = linkage(K_small, method='ward')
col_linkage = linkage(K_small.T, method='ward')

row_order = leaves_list(row_linkage)
col_order = leaves_list(col_linkage)

K_clustered = K_small[np.ix_(row_order, col_order)]

fig = px.imshow(
    K_clustered,
    color_continuous_scale="viridis",
    title="Clustered Kinship Heatmap",
    aspect="auto"
)
fig.update_layout(margin=dict(l=40, r=40, t=60, b=40))
fig.write_html(f"{OUTDIR}/kinship_clustermap.html")
#fig.show()




# 4. Distribution of mean kinship per individual
means = np.nanmean(K, axis=1)
plt.figure(figsize=(8,5))
plt.hist(means, bins=50, color='salmon', edgecolor='black')
plt.title("Distribution of Mean Kinship per Individual")
plt.xlabel("Mean Kinship")
plt.ylabel("Frequency")
plt.savefig(f"{OUTDIR}/kinship_mean_histogram.png", dpi=300)
plt.close()

means = np.nanmean(K, axis=1)
fig = px.histogram(
    means,
    nbins=50,
    title="Distribution of Mean Kinship per Individual",
    labels={'value': 'Mean Kinship'},
    color_discrete_sequence=['salmon']
)
fig.update_traces(marker_line_color="black", marker_line_width=1)
fig.update_layout(xaxis_title="Mean Kinship", yaxis_title="Frequency")
fig.write_html(f"{OUTDIR}/kinship_mean_histogram.html")
#fig.show()


print(f"All plots saved in folder: {OUTDIR}")

