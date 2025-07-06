
## Jennifer O'Halloran

## /25

## Thesis Project: TeaPP Visualisation App Prototype 


import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import os
from sklearn.decomposition import PCA

# ==== Settings ====
KINSHIP_NPY = "kinship.npy"         # Must be 47,000 x 47,000
 # Tab-separated file with 'gener' column

N_COMPONENTS = 10  # Number of PCs to compute

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir) # Scripts
temp_dir = os.path.join(parent_dir,"temp")
GENERATION_FILE = os.path.join(temp_dir, "pedigree.txt")


OUTDIR = os.path.join(parent_dir, "kinship_plots")
os.makedirs(OUTDIR, exist_ok=True)

# ==== Load Kinship Matrix ====
print("Loading kinship matrix...")
K = np.load(KINSHIP_NPY)  
print(f"Kinship matrix shape: {K.shape}")
assert K.shape[0] == K.shape[1], "Kinship matrix must be square."

# ==== Load Generation Info ====
print(f"📄 Loading generation data from {GENERATION_FILE}...")
gen_df = pd.read_csv(GENERATION_FILE, sep="\t", comment="#", header=0)
generations = gen_df["gener"].values

print(f"Kinship rows: {K.shape[0]}")
print(f"Generation rows: {len(gen_df)}")
print("Preview of generation file:")
print(gen_df.head())

assert len(generations) == K.shape[0], "Mismatch between generations and PCA rows"

# Convert to string for color mapping
generations = generations.astype(str)

# ==== Center the Kinship Matrix ====
print("Centering matrix...")
K_mean = np.mean(K, axis=0)
K_centered = K - K_mean

# ==== Run PCA ====
print(f"🔍 Running PCA for {N_COMPONENTS} components...")
try:
    pca = PCA(n_components=N_COMPONENTS)
    pcs = pca.fit_transform(K_centered)
    explained_var = pca.explained_variance_ratio_
    print("✅ PCA shape:", pcs.shape)
    print("📊 Explained variance ratio:", explained_var)

    assert not np.isnan(pcs).any(), "NaNs found in PCA output"
    assert np.all(np.isfinite(pcs)), "Non-finite values in PCA output"
except Exception as e:
    print("❌ PCA failed:", e)
    exit(1)

# ==== Save PCA Output ====
np.save(f"{OUTDIR}/pca_coords.npy", pcs)
np.save(f"{OUTDIR}/pca_variance_ratio.npy", explained_var)

with open(f"{OUTDIR}/explained_variance.txt", "w") as f:
    for i, v in enumerate(explained_var, 1):
        f.write(f"PC{i}: {v*100:.4f}%\n")

# ==== Assign Colors to Generations ====
unique_generations = sorted(set(generations), key=int)
palette = sns.color_palette("Dark2", n_colors=len(unique_generations))
color_map = {gen: palette[i] for i, gen in enumerate(unique_generations)}

# ==== Plot PCA: PC1 vs PC2 ====
print("📈 Plotting PC1 vs PC2 colored by generation...")
plt.figure(figsize=(10, 8))
for gen in unique_generations:
    idx = generations == gen
    plt.scatter(pcs[idx, 0], pcs[idx, 1], s=3, alpha=0.6, label=f"Gen {gen}", color=color_map[gen])

plt.xlabel(f"PC1 ({explained_var[0]*100:.2f}% variance)")
plt.ylabel(f"PC2 ({explained_var[1]*100:.2f}% variance)")
plt.title("PCA of Kinship Matrix Colored by Generation")
plt.legend(markerscale=3, fontsize='small', loc='best')
plt.grid(True)
plt.tight_layout()
plt.savefig(f"{OUTDIR}/pca_by_generation_pc1_pc2.png", dpi=300)
plt.close()

# ==== Optional: PC1 vs PC3 ====
print("📈 Plotting PC1 vs PC3...")
plt.figure(figsize=(10, 8))
for gen in unique_generations:
    idx = generations == gen
    plt.scatter(pcs[idx, 0], pcs[idx, 2], s=3, alpha=0.6, label=f"Gen {gen}", color=color_map[gen])

plt.xlabel(f"PC1 ({explained_var[0]*100:.2f}% variance)")
plt.ylabel(f"PC3 ({explained_var[2]*100:.2f}% variance)")
plt.title("PCA: PC1 vs PC3")
plt.legend(markerscale=3, fontsize='small', loc='best')
plt.grid(True)
plt.tight_layout()
plt.savefig(f"{OUTDIR}/pca_by_generation_pc1_pc3.png", dpi=300)
plt.close()

# ==== Variance Explained ====
print("📊 Plotting variance explained...")
plt.figure(figsize=(8, 5))
plt.plot(np.arange(1, N_COMPONENTS + 1), np.cumsum(explained_var) * 100, marker='o')
plt.xlabel("Number of Principal Components")
plt.ylabel("Cumulative Variance Explained (%)")
plt.title("PCA Variance Explained")
plt.axhline(80, linestyle='--', color='red', alpha=0.5)
plt.grid(True)
plt.tight_layout()
plt.savefig(f"{OUTDIR}/pca_variance_explained.png", dpi=300)
plt.close()

print("✅ PCA completed and plots saved to:", os.path.abspath(OUTDIR))

