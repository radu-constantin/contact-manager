# contact-manager
Tag Functionality:
Tasks:
- Display corresponding tags for each contact;
- Display tag menu;
- If tag on tag menu is clicked - only contacts with that will be shown;


- Create tagSection for each contact; DONE
- Create global tags list;
    - When contact list is initialized, go through each contact and get all the tags;
    - Filter the tag list to hold only unique values;
- Display the tagList beneath the search bar;
- When a tag button is clicked from the tagList, its value is added to the *selectedTagsList*;
- The contact list is filtered to show only contacts that include the selected tag;