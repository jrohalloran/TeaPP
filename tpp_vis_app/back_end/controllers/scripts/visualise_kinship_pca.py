
## Jennifer O'Halloran

## /25

## Thesis Project: TeaPP Visualisation App Prototype 


import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import os
from sklearn.decomposition import PCA
import plotly.express as px
import plotly.graph_objects as go

# ==== Settings ====
KINSHIP_NPY = "kinship.npy"         # Must be 47,000 x 47,000
 # Tab-separated file with 'gener' column

N_COMPONENTS = 10  # Number of PCs to compute

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir) # Scripts
temp_dir = os.path.join(parent_dir,"temp")
GENERATION_FILE = os.path.join(temp_dir, "pedigree.txt")
npy_file = os.path.join(temp_dir,"kinship_matrix.npy")
txt_file = os.path.join(temp_dir,"kinship_matrix.txt")



OUTDIR = os.path.join(parent_dir, "kinship_plots")
os.makedirs(OUTDIR, exist_ok=True)

# ==== Load Kinship Matrix ====
print("Loading kinship matrix...")
K = np.load(npy_file)  
print(f"Kinship matrix shape: {K.shape}")
assert K.shape[0] == K.shape[1], "Kinship matrix must be square."

# ==== Load Generation Info ====
print(f"📄 Loading generation data from {GENERATION_FILE}...")
gen_df = pd.read_csv(GENERATION_FILE, sep="\t", comment="#", header=0)
generations = gen_df["gener"].values
individuals = gen_df["ID"].astype(str).values

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

pca_df = pd.DataFrame(pcs[:, :3], columns=["PC1", "PC2", "PC3"])
pca_df["Generation"] = generations
pca_df["Individual"] = individuals

hover_data={"Individual": True, "Generation": True}

fig = px.scatter(
    pca_df,
    x="PC1",
    y="PC2",
    color="Generation",
    title="PCA of Kinship Matrix: PC1 vs PC2",
    labels={
        "PC1": f"PC1 ({explained_var[0]*100:.2f}% variance)",
        "PC2": f"PC2 ({explained_var[1]*100:.2f}% variance)"
    },
    color_discrete_sequence=px.colors.qualitative.Dark2,
    height=600,
    hover_data={"Individual": True, "Generation": True}
)
fig.update_traces(marker=dict(size=4, opacity=0.7), selector=dict(mode='markers'))
fig.write_html(f"{OUTDIR}/pca_by_generation_pc1_pc2.html")

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

fig = go.Figure()

fig.add_trace(go.Scatter(
    x=np.arange(1, N_COMPONENTS + 1),
    y=np.cumsum(explained_var) * 100,
    mode='lines+markers',
    name='Cumulative Variance'
))

fig.add_hline(y=80, line_dash="dash", line_color="red", annotation_text="80% threshold")

fig.update_layout(
    title="Cumulative Variance Explained by PCA",
    xaxis_title="Number of Principal Components",
    yaxis_title="Cumulative Variance Explained (%)",
    height=500
)

fig.write_html(f"{OUTDIR}/pca_variance_explained.html")
# fig.show()

# === Scree Plot ===
print("Plotting Scree Plot...")
plt.figure(figsize=(8, 6))
components = np.arange(1, N_COMPONENTS + 1)
plt.plot(components, explained_var * 100, marker='o', linestyle='-', color='blue')
plt.xticks(components)
plt.xlabel("Principal Component")
plt.ylabel("Explained Variance (%)")
plt.title("Scree Plot of PCA on Kinship Matrix")
plt.grid(True)
plt.tight_layout()
plt.savefig(f"{OUTDIR}/scree_plot.png", dpi=300)
plt.close()
print("Scree plot saved.")

# === Scree Plot using Eigenvalues ===
print("Plotting Scree Plot (Eigenvalues)...")
eigenvalues = pca.explained_variance_

plt.figure(figsize=(8, 6))
components = np.arange(1, len(eigenvalues) + 1)
plt.plot(components, eigenvalues, marker='o', linestyle='-', color='darkorange')
plt.xticks(components)
plt.xlabel("Principal Component")
plt.ylabel("Eigenvalue")
plt.title("Scree Plot (Eigenvalues) of PCA on Kinship Matrix")
plt.grid(True)
plt.tight_layout()
plt.savefig(f"{OUTDIR}/scree_plot_eigenvalues.png", dpi=300)
plt.close()
print("Scree plot (eigenvalues) saved.")







print("✅ PCA completed and plots saved to:", os.path.abspath(OUTDIR))

