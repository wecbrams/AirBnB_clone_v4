#!/usr/bin/python3
"""Starts a Flask Web Application"""
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
import uuid
app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """Closes the database storage connection."""
    storage.close()


@app.route('/101-hbnb', strict_slashes=False)
def hbnb():
    """
    This route displays a webpage with information about HBNB.
    It retrieves all states, amenities, and places from the database,
    sorts them alphabetically, and renders them in the template 101-hbnb.html.

    Returns:
        A rendered template '101-hbnb.html' with the following arguments:
        - states: a list of states and their associated cities
        - amenities: a list of amenities
        - places: a list of places
        - cache_id: a unique identifier generated using uuid.uuid4()
    """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    return render_template('101-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=str(uuid.uuid4()))


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
