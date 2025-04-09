"""
Helper utility functions.
"""
import json
from datetime import datetime
from typing import Dict, Any, List, Optional


def json_serializer(obj):
    """
    Custom JSON serializer to handle non-JSON serializable objects.
    """
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")


def serialize_to_json(data: Any) -> str:
    """
    Serialize any data to JSON with custom handling of special types.
    """
    return json.dumps(data, default=json_serializer)


def format_complex_to_float(val):
    """
    Format complex numbers to floats by taking the real part.
    """
    if hasattr(val, "real"):
        return float(val.real)
    return val 