import gps

session = gps.gps("localhost", "2974")
session.stream(gps.WATCH_ENABLE | gps.WATCH_NEWSTYLE)

while True
    try:
        report  = session.next()
        print report

    except  KeyError:
        pass
    except KeyboardInterrupt:
        quit()
    except StopIteration:
        session = None
        print "GPSD has terminated"

