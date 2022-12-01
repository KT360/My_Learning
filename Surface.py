
'''
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import cm
from matplotlib.ticker import LinearLocator
from mpl_toolkits.mplot3d import Axes3D
'''
#Temperature function

#f = 8*r.x**2 + 4*r.y*r.z + 16*r.z+600

#Space probe
"""
fig = plt.figure(figsize=plt.figaspect(1))
ax = fig.add_subplot(111, projection='3d')

coefs = (4,1,4)

rx,ry,rz = 16/np.sqrt(coefs)

u = np.linspace(0,2*np.pi,100)
v = np.linspace(0,np.pi,100)

x = rx * np.outer(np.cos(u), np.sin(v))

y = ry * np.outer(np.sin(u),np.sin(v))

z = rz * np.outer(np.ones_like(u), np.cos(v))


ax.plot_surface(x,y,z,(z-4),cmap=cm.coolwarm, rstride=4, cstride=4, color='b')

max_radius = max(rx,ry,rz)

for axis in 'xyz':
    getattr(ax,'set_{}lim'.format(axis))((-max_radius,max_radius))

plt.show()
"""

import matplotlib.pyplot as plt
# This import registers the 3D projection, but is otherwise unused.
from mpl_toolkits.mplot3d import Axes3D  # noqa: F401 unused import
from mpl_toolkits.mplot3d.axes3d import get_test_data
import numpy as np
fig, ax = plt.subplots(subplot_kw={'projection': '3d'})
X, Y, Z = get_test_data(0.05)
C = np.linspace(-5, 5, X.size).reshape(X.shape)
scamap = plt.cm.ScalarMappable(cmap='inferno')
fcolors = scamap.to_rgba(C)
ax.plot_surface(X, Y,Z,facecolors=fcolors, cmap='inferno')
fig.colorbar(scamap)
plt.show()