import io
import pandas as pd

class DataExporter:
    @staticmethod
    def export_to_excel(data: list, sheet_name: str = "Export") -> bytes:
        df = pd.DataFrame(data)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, sheet_name=sheet_name, index=False)
        return output.getvalue()
