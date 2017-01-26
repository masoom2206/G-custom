DEV: /var/www/html/sites/all/modules/custom/agent_dashboard

There is a huge bug in the above referenced module. I happened to be looking on the dev S3 bucket: cbone-ca-staging and noticed 1000s of duplicated images in that directory. There may be 7000 or more. Looking at some I noticed that 99.9% are associated with the above agent_dashboard module.

I am only guessing but it appears to me that field_vendor_contact_picture image is iterated over and over rather then just pointing once to the original of which there are only 20 or so.