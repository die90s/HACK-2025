import sys
import uio

print("Running error logging test...")

def test_error_logging():
    error_buffer = uio.StringIO()

    try:
        print("Forcing ZeroDivisionError...")
        x = 1 / 0  # This will raise an exception
    except Exception as e:
        print("Caught exception. Logging...")
        sys.print_exception(e, error_buffer)
        try:
            with open("error_log.txt", "a") as f:
                f.write("=== Test Error ===\n")
                f.write(error_buffer.getvalue())
                f.write("\n")
            print("Log written to file.")
        except Exception as write_err:
            print("Failed to write log:", write_err)

test_error_logging()