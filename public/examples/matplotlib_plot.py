import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2 * np.pi, 200)

fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].plot(x, np.sin(x), label='sin(x)')
axes[0].plot(x, np.cos(x), label='cos(x)')
axes[0].set_title('Trig Functions')
axes[0].legend()
axes[0].grid(True)

axes[1].bar(['A', 'B', 'C', 'D'], [4, 7, 2, 9], color='steelblue')
axes[1].set_title('Bar Chart')

plt.tight_layout()
plt.show()

print("Rendered 2 subplots.")
