import xml.etree.ElementTree as ET


def parse_event(xml):

    root = ET.fromstring(xml)

    ns = {
        "e": "http://schemas.microsoft.com/win/2004/08/events/event"
    }

    event = {}

    # Event ID
    event["event_id"] = int(
        root.find("e:System/e:EventID", ns).text
    )

    # Computer
    computer = root.find("e:System/e:Computer", ns)
    event["computer"] = computer.text if computer is not None else ""

    # Event Data
    for data in root.findall("e:EventData/e:Data", ns):

        key = data.attrib.get("Name")

        value = data.text if data.text else ""

        event[key] = value

    return event