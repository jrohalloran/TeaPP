
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

# 2. Histogram of kinship values
plt.figure(figsize=(8,5))
plt.hist(K.flatten(), bins=100, color='skyblue', edgecolor='black')
plt.title("Histogram of Kinship Values")
plt.xlabel("Kinship")
plt.ylabel("Frequency")
plt.savefig(f"{OUTDIR}/kinship_histogram.png", dpi=300)
plt.close()

# 3. KDE plot of kinship values
#plt.figure(figsize=(8,5))
#sns.kdeplot(K.flatten(), bw_adjust=0.5)
#plt.title("Density of Kinship Values")
#plt.xlabel("Kinship")
#plt.savefig(f"{outdir}/kinship_density.png", dpi=300)
#plt.close()

# 4. Clustered heatmap
sns.clustermap(K_small, cmap="viridis", figsize=(12, 12))
plt.suptitle("Clustered Kinship Heatmap")
plt.savefig(f"{OUTDIR}/kinship_clustermap.png", dpi=300)
plt.close()

# 5. PCA plot
#pca = PCA(n_components=2)
#coords = pca.fit_transform(K)
#plt.figure(figsize=(8,6))
#plt.scatter(coords[:,0], coords[:,1], s=5)
#plt.title("PCA of Kinship Matrix")
#plt.xlabel("PC1")
#plt.ylabel("PC2")
#plt.savefig(f"{outdir}/kinship_pca.png", dpi=300)
#plt.close()


meta_df = pd.read_table(GENERATION_FILE, dtype={'ID': str})
meta_df = meta_df.set_index('ID')
IDs = [...]
assert len(IDs) == K.shape[0], "Mismatch between IDs and kinship matrix shape"

missing = [i for i in IDs if i not in meta_df.index]
if missing:
    raise ValueError(f"Missing IDs in metadata: {missing}")

# Get generations in order
generations_ordered = meta_df.loc[IDs, 'gener'].astype(str).values

# Encode generation labels
le = LabelEncoder()
generation_labels = le.fit_transform(generations_ordered)

# Perform PCA
pca = PCA(n_components=2)
coords = pca.fit_transform(K)

# PCA
pca = PCA(n_components=2)
coords = pca.fit_transform(K)

# Plot
plt.figure(figsize=(8, 6))
scatter = plt.scatter(coords[:, 0], coords[:, 1], c=generation_labels, cmap='tab10', s=5)
plt.title("PCA of Kinship Matrix")
plt.xlabel("PC1")
plt.ylabel("PC2")

# Legend
handles, _ = scatter.legend_elements(prop="colors", alpha=0.6)
plt.legend(handles, le.classes_, title="Generation", bbox_to_anchor=(1.05, 1), loc='upper left')

# Save
plt.tight_layout()
plt.savefig(f"{OUTDIR}/kinship_pca_coloured.png", dpi=300)
plt.close()

#
# 6. MDS plot
#mds = MDS(n_components=2, dissimilarity='precomputed', random_state=42)
#dist_matrix = 1 - K  # convert kinship to distance-like metric
#mds_coords = mds.fit_transform(dist_matrix)
#plt.figure(figsize=(8,6))
#plt.scatter(mds_coords[:,0], mds_coords[:,1], s=5)
#plt.title("MDS of Kinship Matrix")
#plt.xlabel("Dimension 1")
#plt.ylabel("Dimension 2")
#plt.savefig(f"{outdir}/kinship_mds.png", dpi=300)
#plt.close()

# 7. Distribution of mean kinship per individual
means = np.nanmean(K, axis=1)
plt.figure(figsize=(8,5))
plt.hist(means, bins=50, color='salmon', edgecolor='black')
plt.title("Distribution of Mean Kinship per Individual")
plt.xlabel("Mean Kinship")
plt.ylabel("Frequency")
plt.savefig(f"{OUTDIR}/kinship_mean_histogram.png", dpi=300)
plt.close()

print(f"All plots saved in folder: {OUTDIR}")

