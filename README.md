# bulk_file_transfer_between_buckets
Bulk Files Transfer between Buckets with NodeJS

1.Restart the cloud shell - Important

1.Put the js file on the cloud shell
2.Execute 
>node gcsv.js

2.The app will provide you further instructions!
When it says "You may now make changes to the CSV", you can edit the CSV and upload it back, then press enter.
2-1.
Enter the source directory (gs://ws-p1-sb/sub1/sub2/)
Example > gs://from-pro-to-sandbox/image_files
2-2.
Have you finished making changes to file.csv? (Y/n) 
*If you do not want to transfer specific files, update the csv list
Example>y
2-3.
Enter a path to avoid.. (enter to skip)
*?
Example>[Enter]
2-4.
Keyword to filter by?
*Only files having the keyword will be transferred. upper case and lower case sensitive!
Otherwise, hit enter.
Example>[Enter]
2-5.
How many files to transfer? (enter to skip)
*If you want to linit the number of files to ransfer, you can type the number
Example>[Enter]
2-6.
Specify the operation you would like to perform
  move
❯ copy
2-7.
Enter the destination directory (gs://ws-p1-db/sub1/sub2/)
>gs://level_bucket/images/
