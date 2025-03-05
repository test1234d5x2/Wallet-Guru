import os

def combine_files_from_directories(base_folder, directories, output_file):
    try:
        with open(output_file, 'w') as outfile:
            for directory in directories:
                dir_path = os.path.join(base_folder, directory)
                
                if os.path.exists(dir_path):
                    for root, _, files in os.walk(dir_path):
                        for filename in files:
                            file_path = os.path.join(root, filename)
                            
                            if os.path.isfile(file_path) and filename != os.path.basename(output_file) and str(filename).find(".DS_Store") == -1 and str(file_path).find(".png") == -1 and str(file_path).find("node_modules") == -1 and str(file_path).find("package-lock.json") == -1 and str(file_path).find("package.json") == -1 and str(file_path).find(".map") == -1 and str(file_path).find("/blockchain") == -1:
                                try:
                                    with open(file_path, 'r') as infile:
                                        print(file_path)
                                        outfile.write(f"\n--- Content from {filename} ---\n")
                                        outfile.write(infile.read())
                                        outfile.write("\n")
                                except:
                                    pass
        print(f"Files combined successfully into {output_file}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    base_folder = os.path.dirname(os.path.abspath(__file__))
    directories = ["wallet-guru", "middlewareAPI", "middlewareAPINonPersistent", "recurrenceRuleTest", "blockchain-testing"]
    output_file = input("Enter the output file name (e.g., combined_output.txt): ").strip()

    combine_files_from_directories(base_folder, directories, output_file)